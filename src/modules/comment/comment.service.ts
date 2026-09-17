import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload } from "./comment.interface";

const createComment = async (authorId: string, payload: ICreateCommentPayload) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })
    const comment = await prisma.comment.create({
        data: {
            ...payload,
            authorId
        }
    })
    return comment
};

const getCommentByAuthorId = async () => {

};
const getCommentByCommentId = async () => {

};
const updateComment = async () => {

};
const deleteComment = async () => {

};
const moderateComment = async () => {

};
export const commentService = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}
