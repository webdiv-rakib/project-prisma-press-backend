import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload, IUpdateCommentPayload } from "./comment.interface";

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

const getCommentByAuthorId = async (authorId: string) => {
    const comment = await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
    return comment
};

const getCommentByCommentId = async (postId: string) => {
    const comment = await prisma.comment.findMany({
        where: {
            postId
        }
    })
    return comment
};

const updateComment = async (commentId: string, data: IUpdateCommentPayload, authorId: string) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    });
    const comment = await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data
    });
    return comment
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
