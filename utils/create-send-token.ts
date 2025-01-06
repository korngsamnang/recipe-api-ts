import jwt from "jsonwebtoken";
import { Response } from "express";
import mongoose from "mongoose";
import { IUser } from "../src/models/user-model";

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

export const createSendToken = (
    user: IUser,
    statusCode: number,
    req: Request,
    res: Response
) => {
    const token = signToken(user.id);

    res.cookie("jwt", token, {
        expires: new Date(
            Date.now() +
                parseInt(process.env.JWT_COOKIE_EXPIRES_IN!) *
                    24 *
                    60 *
                    60 *
                    1000
        ),
        httpOnly: true,
        secure: true,
    });

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
