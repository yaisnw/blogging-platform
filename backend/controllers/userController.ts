import { NextFunction, Request, Response } from "express"
import { User } from "../sequelize/models/User"
import { userRequestBody } from "../types/controllerTypes"
import { CustomError, AuthRequest } from "../index"
import bcrypt from "bcryptjs"
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import s3 from "../s3"
import { Op, UniqueConstraintError } from "sequelize"

export const getUser = async (
    req: Request<{ id: number }, {}, userRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId = req.params.id

    try {
        const user = await User.findOne({ where: { id: userId } })
        if (!user) {
            const err = new Error("User not found") as CustomError
            err.status = 404
            return next(err)
        }

        const { password, ...userWithoutPassword } = user.dataValues
        res.status(200).json(userWithoutPassword)
    } catch (err) {
        next(err)
    }
}

export const searchUsers = async (
    req: Request<{}, {}, {}, { q?: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        const users = await User.findAll({
            where: {
                username: { [Op.iLike]: `%${q}%` },
            },
            attributes: ["id", "username", "avatar_url", "email"],
        });

        return res.status(200).json(
            users.length === 0
                ? { message: "No users found", users: [] }
                : { message: "Users retrieved", users }
        );
    } catch (err) {
        next(err);
    }
};


export const updateUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { username, email } = req.body
    const userId = Number(req.params.id)

    try {
        const user = await User.findByPk(userId)
        if (!user) {
            const err = new Error("User doesn't exist") as CustomError
            err.status = 404
            return next(err)
        }

        const [affectedCount, updatedUsers] = await User.update(
            {
                ...(username && { username }),
                ...(email && { email }),
            },
            {
                where: { id: userId },
                returning: true,
            }
        )

        if (affectedCount === 0) {
            const err = new Error("User not found or no changes applied") as CustomError
            err.status = 404
            return next(err)
        }

        const { password, ...userWithoutPassword } = updatedUsers[0].dataValues
        res.status(200).json(userWithoutPassword)
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            const details = err.errors.map(e => ({
                field: e.path,
                message: `${e.path} is already in use. Please choose another one.`,
            }))

            return res.status(400).json({ errors: details })
        }
        next(err)
    }
}

export const changePassword = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const userId = req.user?.id
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            const err = new Error("Both current and new password are required") as CustomError
            err.status = 400
            throw err
        }
        if (currentPassword === newPassword) {
            const err = new Error("Current password and new password cannot be the same") as CustomError
            err.status = 400
            throw err
        }
        const user = await User.findByPk(userId)
        if (!user) {
            const err = new Error("User doesn't exist") as CustomError
            err.status = 404
            throw err
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            const err = new Error("Current password is incorrect") as CustomError
            err.status = 400
            throw err
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedNewPassword
        await user.save()

        res.status(200).json({ message: "Password updated successfully" })
    } catch (err) {
        next(err)
    }
}

export const changeAvatar = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId = req.params.id
    try {
        if (!req.file) {
            const err = new Error("No file uploaded") as CustomError
            err.status = 400
            return next(err)
        }

        const key = `avatars/${Date.now()}-${req.file.originalname}`
        const user = await User.findByPk(userId);
        if (!user) {
            const err = new Error("User doesn't exist") as CustomError;
            err.status = 404;
            throw (err)
        }


        if (user.avatar_url) {
            if (user.avatar_url === process.env.DEFAULT_AVATAR_URL) {
                console.log("Skipping deletion of default avatar");
            }
            else {
                const currentUrlParts = (user.avatar_url || "").split("/");
                const currentKey = currentUrlParts.slice(currentUrlParts.indexOf("avatars")).join("/");


                if (currentKey === key) {
                    const err = new Error("New avatar is the same as the current one") as CustomError;
                    err.status = 400;
                    throw (err)
                }

                const removeCommand = new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME!,
                    Key: currentKey,
                });

                try {
                    await s3.send(removeCommand);
                    console.log(`Deleted old avatar: ${currentKey}`);
                } catch (err) {
                    console.warn("Could not delete old avatar:", err);
                }
            }
        }

        const putCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        })

        await s3.send(putCommand)

        const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

        const [affectedCount] = await User.update(
            { avatar_url: url },
            { where: { id: userId } }
        )

        if (affectedCount === 0) {
            const err = new Error("Picture URL couldn't be saved in the database") as CustomError
            err.status = 400
            return next(err)
        }

        res.status(201).json(url)
    } catch (err) {
        next(err)
    }
}

export const deleteUser = async (
    req: Request<{ id: number }, {}, userRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId: number = req.params.id

    try {
        const user = await User.findOne({ where: { id: userId } })
        if (!user) {
            const err = new Error("User not found") as CustomError
            err.status = 404
            return next(err)
        }

        const deletedUsers = await User.destroy({ where: { id: userId } })
        if (deletedUsers === 0) {
            const err = new Error("User could not be deleted") as CustomError
            err.status = 400
            return next(err)
        }

        res.status(200).json({ message: "User deleted successfully" })
    } catch (err) {
        next(err)
    }
}
