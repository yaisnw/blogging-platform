import { NextFunction, Request, Response } from "express";
import { User } from "../sequelize/models/user";
import bcrypt from "bcryptjs";
import "express-session";
import { userRequestBody } from "../types/controllerTypes";
import { CustomError } from "..";
import { Op } from "sequelize";

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      email: string;
    };
  }
}

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
      msg: "Account created successfully!",
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

    req.session.user = {
      id: existingUser.id,
      username: existingUser.username,
      email: existingUser.email
    };

    return res.status(200).json({
      msg: "You have logged in successfully!",
      user: { id: existingUser.id, username: existingUser.username, email: existingUser.email },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request<{}, {}, userRequestBody, {}>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  req.session.user = undefined;

  req.session.save(function (err) {
    if (err) return next(err);

    req.session.regenerate(function (err) {
      if (err) return next(err);

      res.redirect('/');
    });
  });
};
