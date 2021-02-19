const Query = {
    users(parent, args, { prisma }, info){

        const opArgs = {}
        
        if(args.query)
            opArgs.where = {
                OR : [
                    {
                        name : {
                            contains : args.query
                        }
                    },
                    {
                        email : {
                            contains : args.query
                        }
                    }
                ]
            }
        return prisma.user.findMany(opArgs)
    },
    posts(parent, args, { prisma }, info){
        
        const opArgs = {}

        if(args.query)
            opArgs.where = {
                OR : [
                    {
                        title : {
                            contains : args.query
                        }
                    },
                    {
                        body : {
                            contains : args.query
                        }
                    }
                ]
            }
        return prisma.post.findMany(opArgs)
    },
    comments(parent, args, { prisma }, info){
        
        const opArgs = {}

        if(args.query)
            opArgs.where = {
                text : {
                    contains : args.query
                }
            }
        return prisma.comment.findMany(opArgs)
    }
}

export { Query as default }