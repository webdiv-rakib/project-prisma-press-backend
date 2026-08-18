import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const post = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});

export const postController = {
    post
}