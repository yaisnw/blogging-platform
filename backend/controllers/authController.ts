import express, { NextFunction, Request, Response } from "express"
import { User } from "../sequelize/models/user"
import bcrypt from "bcryptjs"
import "express-session"
import { requestBody } from "../types/controllerTypes"
import { CustomError } from ".."

declare module 'express-session' {
    interface SessionData {
        user?: {
            id: number,
            username: string
        }
    }
}




export const registerUser = async (
    req: Request<{}, {}, requestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { username, password } = req.body;

    if (!username || !password) {
        const err = new Error("Please enter username and password") as CustomError;
        err.status = 400;
        throw err;
    }

    try {
        const existingUser = await User.findOne({ where: { username } })
        if (existingUser) {
            const err = new Error("User already exists") as CustomError;
            err.status = 400;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username,
            password: hashedPassword
        })

        return res.status(201).json({
            msg: "User registered successfully",
            user: { id: newUser.id, username: newUser.username }
        })
    }
    catch (err) {
        next(err)
    }
}

export const loginUser = async (
    req: Request<{}, {}, requestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { username, password } = req.body;

    if (!username || !password) {
        const err = new Error("Enter username and password") as CustomError;
            err.status = 400;
            throw err;
    }

    try {
        const existingUser = await User.findOne({ where: { username } })

        if (!existingUser) {
            const err = new Error("User not found") as CustomError;
            err.status = 404;
            throw err;
        }
        const matchedPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchedPassword) {
            const err = new Error("Incorrect password") as CustomError;
            err.status = 401;
            throw err;
        }
        req.session.user = {
            id: existingUser.id,
            username: existingUser.username
        };


        return res.status(200).json({
            msg: "Login successful",
            user: { id: existingUser.id, username: existingUser.username },
        });
    } catch (err) {
        next(err)
    }
}
