import { NextFunction, Request, Response } from "express";
import { User } from "../sequelize/models/User";
import bcrypt from "bcryptjs";
import "express-session";
import { userRequestBody } from "../types/controllerTypes";
import { CustomError } from "..";
import { Op } from "sequelize";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      email: string;
    };
  }
}

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:5173/oauth'
});

export const signUpUser = async (
  req: Request<{}, {}, userRequestBody, {}>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    const err = new Error("Please provide a username, email, and password.") as CustomError;
    err.status = 400;
    throw err;
  }

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { username: req.body.username }
        ]
      }
    });

    if (existingUser) {
      const err = new Error("This username or email is already in use. Please choose a different one.") as CustomError;
      err.status = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Account created successfully!",
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  req: Request<{}, {}, userRequestBody, {}>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error("Please enter both your email and password.") as CustomError;
    err.status = 400;
    throw err;
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      const err = new Error("No account found with this email. Please sign up.") as CustomError;
      err.status = 404;
      throw err;
    }

    const matchedPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchedPassword) {
      const err = new Error("The password you entered is incorrect.") as CustomError;
      err.status = 401;
      throw err;
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        avatar_url: existingUser.avatar_url
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: "You have logged in successfully!",
      token,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        avatar_url: existingUser.avatar_url
      }
    });

  } catch (err) {
    next(err);
  }
};
export const googleOAuth = async (
  req: Request<{}, {}, { code: string }, {}>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { code } = req.body;

  try {
    const { tokens } = await client.getToken(code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const username = payload?.name;
    const googleId = payload?.sub

    if (!email || !googleId) {
      const err = new Error("Google authentication failed. Missing required user info.") as CustomError;
      err.status = 400;
      throw err;
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        email,
        googleId,
        username,
        password: null,
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    res.status(200).json({
      token
    })
  }
  catch (err) {
    next(err)
  }

}


