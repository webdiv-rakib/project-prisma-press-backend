import { jwtUtils } from './../../utils/jwt';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { userService } from './user.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import config from '../../config';

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
    // res.status(httpStatus.CREATED).json({
    //     success: true,
    //     statusCode: httpStatus.CREATED,
    //     message: 'User Register successfully',
    //     data: {
    //         user
    //     }
    // })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User Registered Successfully',
        data: { user }
    })
});

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret)

    if (typeof verifiedToken === "string") {
        throw new Error(verifiedToken)
    }
    const profile = await userService.getMyProfileFromDB(verifiedToken.id)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Profile Fetched Successfully",
        data: {
            profile
        }
    })
})

export const userController = {
    createUser,
    getMyProfile
}

// will start working soon
// getting into work