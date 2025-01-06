import AppError from "../../utils/app-error";

interface Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
    message?: string;
    stack?: string;
    path?: string;
    value?: string;
    errmsg?: string;
    errors?: { [key: string]: { message: string } };
    name?: string;
    code?: number;
}

const handleCastErrorDB = (err: Error): AppError => {
    const message: string = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicatedFieldsDB = (err: Error): AppError => {
    const value: string = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message: string = `Duplicated field value ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: Error): AppError => {
    const errors: string[] = Object.values(err.errors).map(el => el.message);
    const message: string = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
};

const handleJWTError = (): AppError =>
    new AppError("Invalid token, Please log in again!", 401);

const handleJWTExpiredError = (): AppError =>
    new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err: Error, res: any): void => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err: Error, res: any): void => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error("ERROR 💥", err);
        res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
};

export const globalErrorHandler = (
    err: Error,
    req: any,
    res: any,
    next: any
): void => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        let error: Error = Object.create(err);
        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicatedFieldsDB(error);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};
