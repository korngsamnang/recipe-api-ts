import express, { Request, Response, NextFunction } from "express";

import { getAllUser, getCurrentUser } from "../controllers/user-controller";
import {
    login,
    logout,
    protect,
    register,
} from "../controllers/auth-controller";

const router = express.Router();

router
    .route("/")
    .get((req: Request, res: Response, next: NextFunction) =>
        getAllUser(req, res)
    );
router
    .route("/current")
    .get(protect, (req: Request, res: Response, next: NextFunction) =>
        getCurrentUser(req, res)
    );

router.post("/register", (req: Request, res: Response, next: NextFunction) =>
    register(req, res, next)
);
router.post("/login", (req: Request, res: Response, next: NextFunction) =>
    login(req, res, next)
);
router.get("/logout", (req: Request, res: Response, next: NextFunction) =>
    logout(req, res)
);

export default router;
