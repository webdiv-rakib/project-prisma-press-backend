import httpStatus  from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { catchAsync } from './../../utils/catchAsync';
import { authService } from './auth.service';
import { sendResponse } from '../../utils/sendResponse';

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const loginResult = await authService.loginUser(payload);
    sendResponse(res,{
        success:true,
        statusCode: httpStatus.CREATED,
        message:"User is logged in Successfully",
        data: loginResult
    })
})
export const authController = {
    loginUser
}

// working on auth system
// getting behing and behind day by day
// will start working for today.