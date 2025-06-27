import { NextFunction, Request, Response } from "express"
import { User } from "../sequelize/models/user"
import { userRequestBody } from "../types/controllerTypes"
import { CustomError } from "../index"


export const getUser = async (
    req: Request<{ id: number }, {}, userRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({ where: { id: userId } })

        if (!user) {
            const err = new Error("User not found") as CustomError;
            err.status = 404;
            throw err;
        }
        const { password, ...userWithoutPassword } = user.dataValues;
        return res.status(200).json(userWithoutPassword)
    }
    catch (err) {
        next(err)
    }
}
export const deleteUser = async (
    req: Request<{ id: number }, {}, userRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId: number = req.params.id;

    try {
        const user = await User.findOne({ where: { id: userId } })
        if (!user) {
            const err = new Error("User not found") as CustomError;
            err.status = 404;
            throw err;
        }
        const deletedUsers = await User.destroy({ where: { id: userId } })
        if (deletedUsers !== 0) {
            return res.status(200).json({ message: "User deleted successfully" })
        }
        else {
            const err = new Error("User could not be deleted") as CustomError;
            err.status = 404;
            throw err;
        }
    }
    catch (err) {
        next(err)
    }
}