import { Request, Response } from "express";
import User from "../models/user-model";

export const getAllUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const users: Array<any> = await User.find({});

    res.status(200).json({
        status: "success",
        result: users.length,
        data: {
            users,
        },
    });
};

export const getCurrentUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.status(200).json({
        status: "success",
        isAuthenticated: true,
        data: {
            user: req.user,
        },
    });
};
