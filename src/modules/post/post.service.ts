import { prisma } from "../../lib/prisma"
import { ICreatePostPayload } from "./post.interface"

const createPost = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })
    return result
};

const getAllPosts = async () => {
    const posts = await prisma.post.findMany({
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })
    return posts
};
const getPostsById = async () => {

}
const updatePost = async () => {

}
const deletePost = async () => {

}
const getPostsStats = async () => {

}
const getMyPosts = async () => {

}

export const postService = {
    createPost,
    getAllPosts,
    getPostsById,
    updatePost,
    deletePost,
    getPostsStats,
    getMyPosts
}