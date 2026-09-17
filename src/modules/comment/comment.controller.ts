import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";

const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const result = await commentService.createComment(authorId, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Comment Created Successfully",
        data: result
    })
});
const getCommentByAuthorId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});
const getCommentByPostId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});
const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});
const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});
const moderateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});

export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentByPostId,
    updateComment,
    deleteComment,
    moderateComment
}