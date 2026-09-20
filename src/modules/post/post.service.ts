import { title } from "node:process";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IPostQuery, IUpdatePostPayload } from "./post.interface"
import { PostWhereInput } from "../../../generated/prisma/models";

// create post in Database
const createPost = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })
    return result
};

// get all post from Database
const getAllPosts = async (query: IPostQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc";

    const tags = query.tags ? JSON.parse(query.tags as string) : null
    const tagsArray = Array.isArray(tags) ? tags : []

    const andCondition: PostWhereInput[] = [];
    if (query.searchTerm) {
        andCondition.push({
            OR: [{
                title: {
                    contains: query.searchTerm,
                    mode: "insensitive"
                }
            },
            {
                content: {
                    contains: query.searchTerm,
                    mode: "insensitive"
                }
            }]
        })
    }
    if (query.title) {
        andCondition.push({
            title: query.title
        })
    }
    if (query.content) {
        andCondition.push({
            content: query.content
        })
    }
    if (query.authorId) {
        andCondition.push({
            authorId: query.authorId
        })
    }
    if (query.isFeatured) {
        andCondition.push({
            isFeatured: Boolean(query.isFeatured)
        })
    }
    if (query.tags) {
        andCondition.push({
            tags: {
                hasSome: tagsArray
            }
        })
    }
    if (query.status) {
        andCondition.push({
            status: query.status
        })
    }
    const posts = await prisma.post.findMany({
        //=====fintering/exact match without AND operator
        // where:{
        //     title:"My Second Post",
        //     content:"Messi"
        // },

        //=====fintering/exact match with AND operator
        // where: {
        //     AND: [
        //         {
        //             title: "My Second Post"
        //         },
        //         {
        //             content: "Messi"
        //         }
        //     ]
        // },

        //===searching or partial match
        // where: {
        //     title: {
        //         contains: "Ronaldo",
        //         mode: 'insensitive'
        //     },
        //     content: {
        //         contains: "Ronaldo"
        //     }
        // },

        // searching with OR operator
        // where: {
        //     OR: [
        //         {
        //             title: {
        //                 contains: "Ronaldo",
        //                 mode: "insensitive"
        //             },

        //         },
        //         {
        //             content: {
        //                 contains: "Ronaldo",
        //                 mode: "insensitive"
        //             }
        //         }
        //     ]
        // },

        //combining search(OR) and filtering(AND)
        // where: {
        //     //filtering with AND operator
        //     AND: [
        //         {
        //             //searching with OR operator
        //             OR: [
        //                 {
        //                     title: {
        //                         contains: "Ron",
        //                         mode: "insensitive"
        //                     }
        //                 },
        //                 {
        //                     content: {
        //                         contains: "Ron",
        //                         mode: "insensitive"
        //                     }
        //                 }
        //             ]
        //         },

        //         //filtering
        //         {
        //             title: "Christiano Ronaldo"
        //         },
        //         {
        //             content: "Ronald  "
        //         }
        //     ]

        // },

        //pagination
        // take: 1,
        // skip: 1,

        //sorting with asc and desc
        // orderBy: {
        //     createdAt: 'desc',
        //     title: "asc",
        //     content: "asc"
        // },

        //dynamic searching,filtering,pagination and sorting
        // where: {
        //     AND: [
        //         query.searchTerm ? {
        //             OR: [
        //                 {
        //                     title: {
        //                         contains: query.searchTerm,
        //                         mode: "insensitive"
        //                     }
        //                 },
        //                 {
        //                     content: {
        //                         contains: query.searchTerm,
        //                         mode: "insensitive"
        //                     }
        //                 }
        //             ]
        //         } : {},

        //         //title filtering
        //         query.title ? { title: query.title } : {},

        //         //content filtering
        //         query.content ? { content: query.content } : {}
        //     ]
        // },

        where: {
            AND: andCondition
        },
        //pagination
        take: limit,
        skip: skip,

        //orderby
        orderBy: {
            //sortBy || sortOrder
            [sortBy]: sortOrder
        },
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

// get post by id from database
const getPostsById = async (postId: string) => {
    // const post = await prisma.post.findUniqueOrThrow({
    //     where: {
    //         id: postId
    //     }
    // })


    //=========First Part======================
    // await prisma.post.update({
    //     where: {
    //         id: postId
    //     },
    //     data: {
    //         views: {
    //             increment: 1
    //         }
    //     },
    //     // include: {
    //     //     author: {
    //     //         omit: {
    //     //             password: true
    //     //         }
    //     //     },
    //     //     comments: true
    //     // }
    // })


    //=========Second Part==============
    // const post = await prisma.post.findUniqueOrThrow({
    //     where: {
    //         id: postId
    //     },
    //     include: {
    //         author: {
    //             omit: {
    //                 password: true
    //             }
    //         },

    //         comments: {
    //             where: {
    //                 status: CommentStatus.APPROVED
    //             },
    //             orderBy: {
    //                 createdAt: "desc"
    //             }
    //         },
    //         _count: {
    //             select: {
    //                 comments: true
    //             }
    //         }
    //     }
    // })
    // return post

    //working on transaction and rollback
    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: postId
                },
                data: {
                    views: {
                        increment: 1
                    }
                }
            });
            // throw new Error('something wrong happened')
            const post = await tx.post.findUniqueOrThrow({
                where: {
                    id: postId
                },
                include: {
                    author: {
                        omit: {
                            password: true
                        }
                    },

                    comments: {
                        where: {
                            status: CommentStatus.APPROVED
                        },
                        orderBy: {
                            createdAt: "desc"
                        }
                    },
                    _count: {
                        select: {
                            comments: true
                        }
                    }
                }
            });
            return post
        }
    );
    return transactionResult;
}

// update post by id
const updatePost = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })
    if (!isAdmin && post.authorId !== authorId) {
        throw new Error('You are not the owner of this post')
    }
    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })
    return result
}

// delete post by id
const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })
    if (!isAdmin && post.authorId !== authorId) {
        throw new Error('You are not the owner of this post')
    }
    const result = await prisma.post.delete({
        where: {
            id: postId
        }
    })
}

// 
const getPostsStats = async () => {
    const transactionResult = await prisma.$transaction(
        async (tx) => {
            // const totalPosts = await tx.post.count();

            // const totalPublishedPost = await tx.post.count({
            //     where: {
            //         status: PostStatus.PUBLISHED
            //     }
            // });
            // const totalDraftPost = await tx.post.count({
            //     where: {
            //         status: PostStatus.DRAFT
            //     }
            // });
            // const totalArchivedPost = await tx.post.count({
            //     where: {
            //         status: PostStatus.ARCHIVED
            //     }
            // });

            // const totalComments = await tx.comment.count();

            // const totalApprovedComments = await tx.comment.count({
            //     where: {
            //         status: CommentStatus.APPROVED
            //     }
            // });
            // const totalRejectedComments = await tx.comment.count({
            //     where: {
            //         status: CommentStatus.REJECT
            //     }
            // });
            //=========comment out==============
            // not a good approach to count that way
            // const allPosts = await tx.post.findMany();
            // let totalPostViews = 0;
            // allPosts.forEach((post) => {
            //     totalPostViews = totalPostViews + post.views
            // });
            //=======================
            // const totalPostViewsAggregate = await tx.post.aggregate({
            //     _sum: {
            //         views: true
            //     }
            // });
            // const totalPostViews = totalPostViewsAggregate._sum.views;

            // return {
            //     totalPosts,
            //     totalPublishedPost,
            //     totalDraftPost,
            //     totalArchivedPost,
            //     totalComments,
            //     totalApprovedComments,
            //     totalRejectedComments,
            //     totalPostViews
            // }
            const [totalPosts, totalPublishedPost, totalDraftPost, totalArchivedPost, totalComments, totalApprovedComments, totalRejectedComments, totalPostViewsAggregate] = await Promise.all([
                await tx.post.count(),
                await tx.post.count({
                    where: {
                        status: PostStatus.PUBLISHED
                    }
                }),
                await tx.post.count({
                    where: {
                        status: PostStatus.DRAFT
                    }
                }),
                await tx.post.count({
                    where: {
                        status: PostStatus.ARCHIVED
                    }
                }),
                await tx.comment.count(),
                await tx.comment.count({
                    where: {
                        status: CommentStatus.APPROVED
                    }
                }),
                await tx.comment.count({
                    where: {
                        status: CommentStatus.REJECT
                    }
                }),
                await tx.post.aggregate({
                    _sum: {
                        views: true
                    }
                })
            ])
            return {
                totalPosts,
                totalPublishedPost,
                totalDraftPost,
                totalArchivedPost,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViews: totalPostViewsAggregate._sum.views
            }
        }
    );
    return transactionResult;
}

// get my post by user login
const getMyPosts = async (authorId: string) => {
    const result = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            comments: true,
            author: {
                omit: {
                    password: true
                }
            },
            _count: {
                select: {
                    comments: true
                }
            }
        }
    });
    return result
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