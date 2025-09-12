import { NextFunction, Request, Response } from "express";
import { CustomError, AuthRequest } from "../index";
import {  Post, User, Like } from "../sequelize/models";
import { Op } from "sequelize";


export const addLike = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { postId } = req.body;
  const userId = req.user?.id;

  if (!userId || !postId) {
    const err = new Error("UserId and postId are required") as CustomError;
    err.status = 400;
    return next(err);
  }

  try {
    const [like, created] = await Like.findOrCreate({
      where: { userId, postId },
      defaults: { userId, postId },
    });

    if (!created) {
      const err = new Error("Like already exists") as CustomError;
      err.status = 400;
      throw err;
    }

    res.status(201).json({ message: "Like added successfully", like });
  } catch (err) {
    next(err);
  }
};

export const removeLike = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { postId } = req.body;
  const userId = req.user?.id;

  if (!userId || !postId) {
    const err = new Error("UserId and postId are required") as CustomError;
    err.status = 400;
    return next(err);
  }

  try {
    const deleted = await Like.destroy({ where: { userId, postId } });

    if (deleted === 0) {
      const err = new Error("Like not found") as CustomError;
      err.status = 404;
      throw err;
    }

    res.status(200).json({ message: "Like removed successfully" });
  } catch (err) {
    next(err);
  }
};

export const getLikesByPostId = async (
  req: Request<{ postId: number }>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { postId } = req.params;

  if (!postId) {
    const err = new Error("Please provide a postId") as CustomError;
    err.status = 400;
    return next(err);
  }

  try {
    const likes = await Like.findAll({
      where: { postId },
      include: [
        { model: User, attributes: ["id", "username", "avatar_url"] },
        { model: Post, attributes: ["id", "title", "status"] },
      ],
    });

    res.status(200).json({
      message: likes.length === 0 ? "No likes for this post" : "Likes retrieved successfully",
      likes,
    });
  } catch (err) {
    next(err);
  }
};

export const getLikesByUserId = async (
  req: Request<{ userId: number }>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { userId } = req.params;

  if (!userId) {
    const err = new Error("Please provide a userId") as CustomError;
    err.status = 400;
    return next(err);
  }

  try {
    const likes = await Like.findAll({
      where: { userId },
      include: [{ model: Post, attributes: ["id", "title", "status"] }],
    });

    res.status(200).json({
      message: likes.length === 0 ? "No likes for this user" : "Likes retrieved successfully",
      likes,
    });
  } catch (err) {
    next(err);
  }
};
