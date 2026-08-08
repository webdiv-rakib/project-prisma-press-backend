import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { userService } from './user.service';
import { catchAsync } from '../../utils/catchAsync';

// const createUser = async (req: Request, res: Response) => {
//     try {
// const payload = req.body;
// const user = await userService.createUserIntoDB(payload)


// res.status(httpStatus.CREATED).json({
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: 'User Register successfully',
//     data: {
//         user
//     }
// })
//     } catch (error) {
//         console.log(error)
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//             message: 'Failed to register user',
//             error: (error as Error).message
//         })
//     }
// }

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.createUserIntoDB(payload)
    res.status(httpStatus.CREATED).json({
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User Register successfully',
        data: {
            user
        }
    })
})

export const userController = {
    createUser
}