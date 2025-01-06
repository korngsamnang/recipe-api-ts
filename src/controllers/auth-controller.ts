import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";
import {catchAsync} from "../../utils/catch-async";
import AppError from "../../utils/app-error";
import {createSendToken} from "../../utils/create-send-token";
import User, {IUser} from "../models/user-model";

export const register = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = (await User.findOne({
            username: req.body.username,
        })) as IUser | null;
        if (user) {
            return next(new AppError("User already exists", 401));
        }

        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password,
        });

        delete newUser.password; // Remove password from the response

        res.status(201).json({
            status: "success",
            data: {
                user: newUser,
            },
        });
    }
);

export const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {username, password} = req.body;

        if (!username || !password) {
            return next(new AppError("Please provide name and password!", 400));
        }

        // Explicitly define the result of findOne as IUser | null
        const user = (await User.findOne({username}).select(
            "+password"
        )) as IUser | null;

        if (!user || !(await user.correctPassword(password, user.password!))) {
            return next(new AppError("Incorrect username or password", 401));
        }

        createSendToken(user, 200, req, res);
    }
);

export const protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let token: string | undefined;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(
                new AppError(
                    "You are not logged in! Please log in to get access.",
                    401
                )
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as jwt.JwtPayload;

        const currentUser = (await User.findById(decoded.id)) as IUser | null;
        if (!currentUser) {
            return next(
                new AppError(
                    "The user belonging to this token no longer exists.",
                    401
                )
            );
        }

        req.user = currentUser;
        next();
    }
);

export const logout = (req: Request, res: Response): void => {
    res.cookie("jwt", "", {
        expires: new Date(Date.now() + 10 * 1000),
        sameSite: "none",
        httpOnly: true,
        secure: true,
    });
    res.status(200).json({status: "success"});
};
