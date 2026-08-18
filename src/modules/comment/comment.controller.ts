import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const comment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});

export const commentController = {
    comment
}