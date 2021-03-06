const Post = {
    async author(parent, args, { prisma }, info){
        return await prisma.user.findUnique({
            where : {
                id : parent.authorId
            }
        })
    },
    async comments(parent, args, { prisma }, info) {
        return await prisma.comment.findMany({
            where : {
                postId : parent.id
            }
        })
    }
}

export { Post as default }