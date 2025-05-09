import express, {Request, Response} from "express"
import { User } from "../sequelize/models/user"
import bcrypt from "bcryptjs"
import "express-session"

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number,
      username: string
    }
  }
}

interface requestBody {
    username: string,
    password: string
}


export const registerUser = async (
    req: Request<{}, {}, requestBody, {}>,  
    res: Response
): Promise<Response> => {
    const {username, password} = req.body;
    
    if (!username || !password) {
        return res.status(400).json({msg:"Username and password are required"})
    }

    try {
        const existingUser = await User.findOne({ where: { username }})
        if (existingUser) {
            return res.status(400).json({msg: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const newUser = await User.create({
            username,
            password: hashedPassword
        })

        return res.status(201).json({
            msg: "User registered successfully",
            user: {id:newUser.id, username: newUser.username}
        })
    }
    catch(e) {
        console.error("Error registering user", e)
        return res.status(500).json({msg:"internal server error"})

    }
}

export const loginUser = async (
    req: Request<{}, {}, requestBody, {}>,
    res: Response
): Promise<Response> => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({msg:"Username and password are required"})
    }
    
    try {
        const existingUser = await User.findOne({ where: {username}})

        if(!existingUser) {
            return res.status(404).json({msg: "This user doesn't exist"})
        }
        const matchedPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchedPassword) {
            return res.status(401).json({ msg: "Incorrect password" });
        }
        req.session.user = {
            id: existingUser.id,
            username: existingUser.username
        };
 
        
        return res.status(200).json({
            msg: "Login successful",
            user: { id: existingUser.id, username: existingUser.username },
            session: req.session
        });
    } catch (error) {
        console.error("Error during login", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
