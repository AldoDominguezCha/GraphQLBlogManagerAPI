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
    }

}

export { Subscription as default }