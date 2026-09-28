import { prisma } from "../../lib/prisma";

const getPremiumContent = async () => {
    const post = await prisma.post.findMany({
        where: {
            isPremium: true,
        }
    })
    return post
};



export const premiumService = {
    getPremiumContent
}                                                                                                                                                                                                   