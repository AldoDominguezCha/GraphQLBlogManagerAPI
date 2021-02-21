import getUserId from './../utils/getUserId'

const User = {
    email(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)

        if(userId === parent.id)
            return parent.email
        return null
    },

    async posts(parent, args, { prisma }, info) {
        return await prisma.post.findMany({
            where : {
                AND : [
                    {
                        authorId : parent.id
                    },
                    {
                        published : true
                    }
                ]
            }
        })
    },
    async comments(parent, args, { prisma }, info) {
        return await prisma.comment.findMany({
            where : {
                authorId : parent.id
            }
        })
    }
}

export { User as default }