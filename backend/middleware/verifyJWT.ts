import { AuthRequest } from "../types/controllerTypes.js";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";


/**
 * Populates req.user when a valid token is present, but lets anonymous requests
 * through. For public endpoints that still personalise their response — e.g.
 * post details needs req.user.id to compute `hasLiked`, but logged-out readers
 * must still be able to view the post.
 */
export const optionalJWT = (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    try {
        const token = authHeader.split(" ")[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET!) as AuthRequest["user"];
    } catch {
        // Invalid/expired token on a public route: continue as anonymous rather
        // than rejecting, so a stale token doesn't block reading a public post.
    }
    next();
};

export const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthRequest["user"];
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};