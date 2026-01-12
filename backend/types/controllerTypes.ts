import {Request} from "express";

export type userRequestBody = {
  username: string;
  email?: string;
  password: string;
}


export interface postRequestBody {
    title: string,
    content: string,
    status: string,
    likes: number
}

export interface commentRequestBody {
    content: string,
    postId: number,
    authorId: number
}

export interface pictureRequestBody {
    postId: string | number,
}

export interface PictureAttributes {
  id: number;
  imageUrl: string;
  postId: number;
}

export interface CustomError extends Error {
  status: number;
  payload: any
}
interface AuthUser {
  id: number;
  email: string;
  username: string;
}

export interface AuthRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any> 
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: AuthUser;
  file?: Express.Multer.File;
}