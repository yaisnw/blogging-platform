import { Request, Response, NextFunction } from "express";
import express from 'express';
import { Picture } from "../sequelize/models";
import { PictureAttributes, pictureRequestBody } from "../types/controllerTypes";
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '../s3';
import { CustomError } from "..";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const addPicture = async (
    req: Request<{}, {}, pictureRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { postId } = req.body
    try {
        if (!req.file) {
            const err = new Error('no file uploaded') as CustomError
            err.status = 400
            throw err
        }

        const key = `uploads/${Date.now()}-${req.file.originalname}`;

        const putCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        });

        await s3.send(putCommand);

        const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        const pgPicture = await Picture.create({
            imageUrl: url,
            postId
        })
        if (!pgPicture) {
            const err = new Error("Picture url couldn't be saved in the database") as CustomError
            err.status = 400;
            throw err
        }
        res.status(201).json({ url });
    }
    catch (err) {
        next(err)
    }
}

export const getAllPicturesByPostId = async (
    req: Request<{ postId: number }, {}, pictureRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { postId } = req.params;
    try {
        const picture = await Picture.findAll({
            where: { postId }
        })
        if (!picture) {
            const err = new Error("Pictures couldn't be received") as CustomError
            err.status = 400;
            throw err
        }
        if (picture.length !== 0){
            res.status(200).json({ message: "Pictures found", picture })
        }
        else {
            res.status(200).json({message: "No pictures found"})
        }
    }
    catch (err) {
        next(err)
    }
}

export const deletePicturesByPostId = async (
    req: Request<{ postId: number }, {}, {}, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { postId } = req.params;

    try {
        const pictures = await Picture.findAll({ where: { postId } });

        if (!pictures || pictures.length === 0) {
            const err = new Error(`No pictures found for postId ${postId}`) as CustomError;
            err.status = 404;
            throw err;
        }

        for (const pic of pictures) {
            const url = pic.imageUrl
            const urlParts = url.split('/');
            const key = urlParts.slice(3).join('/');

            const deleteCommand = new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: key,
            });

            await s3.send(deleteCommand);
        }

        await Picture.destroy({ where: { postId } });

        return res.status(200).json({ message: `Deleted all pictures for postId ${postId}` });

    } catch (err) {
        next(err);
    }
};