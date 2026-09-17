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
    const { authorId } = req.params;
    const result = await commentService.getCommentByAuthorId(authorId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comments retrieved successfully",
        data: result
    })
});

const getCommentByPostId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params
    const result = await commentService.getCommentByCommentId(postId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment retrieved successfully",
        data: result
    })
});

const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { commentId } = req.params;
    const authorId = user?.id as string;
    const payload = req.body;
    const result = await commentService.updateComment(commentId as string, payload, authorId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment updated successfully",
        data: result
    })
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