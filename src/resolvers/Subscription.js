import getUserId from './../utils/getUserId'

const Subscription = {
    comment: {
        async subscribe(parent, { postId }, { pubsub, prisma }, info) {
            const post = await prisma.post.findUnique({
                where : {
                    id : postId
                }
            })

            if(!post) throw new Error('The post was not found.')

            //Setting the name of the subscription channel with a template string
            return pubsub.asyncIterator(`comment:${post.id}`)

        }
    },

    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator('post')
        }
    },

    myUser : {
        async subscribe(parent, args, { pubsub, request, prisma }, info) {
            
            const userId = getUserId(request)

            const user = await prisma.user.findUnique({
                where : {
                    id : userId
                }
            })

            if(!user)
                throw new Error('The provided user was not found.')

            return pubsub.asyncIterator(`user:${user.id}`)
        
            
        }
    }

}

export { Subscription as default }