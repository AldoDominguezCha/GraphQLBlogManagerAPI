const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const main = async () => {
    await prisma.user.create({
        data : {
            name : "TestUser2",
            email : "test2@test.com",
        }
    })

    await prisma.post.create({
        data : {
            title : "TestPost2",
            body : "Testing",
            published : false,
            authorId : 1
        }
    })

    await prisma.comment.create({
        data : {
            text : "TestComment2",
            authorId : 1,
            postId : 1
        }
    })


    const allUsers = await prisma.user.findMany({
        include : {
            posts : true,
            comments : true
        }
    })
    console.log(allUsers)
    console.log(allUsers.posts[0])
    console.log(allUsers.comments[0])
}

const main2 = async () => {
    
    /* await prisma.comment.create({
        data : {
            text : "TestComment4",
            authorId : 3,
            postId : 2
        }
    }) */


    const allUsers = await prisma.user.findMany({
        include : {
            posts : true,
            comments : true
        }
    })
    console.log(allUsers)
    console.log(allUsers[1].posts)
    console.log(allUsers[1].comments)
}

const createPost = async () => {
    await prisma.post.create({
        data : {
            id : "ABCDEFG",
            title : "HolaTestingHola",
            body : "Unrelated!",
            published : true,
            authorId : "c8fc4667-03ff-4b78-b70a-858d3dc50ef5"
        }
    })

    const users = await prisma.user.findMany({
        include : {
            posts : true
        }
    })

    console.log(JSON.stringify(users, undefined, 3))
}

const updatePost = async () => {
    const post = await prisma.post.update({
        where : { id : 1 },
        data : { 
            published : false,
            content : "I just added this!" 
        }
    })
    console.log(post)
}

const updatePostandGet = async () => {
    /* await prisma.post.update({
        data : {
            published : 
        }
    }) */

    await prisma.post.update({
        data : {
            body : "I just updated this!",
            published : true
        },
        where : {
            id : 1
        }
    })

    const posts = await prisma.post.findMany({
        include : {
            author : true,
            comments : true
        }
    })

    console.log(JSON.stringify(posts, undefined, 2))

}

const testNotFound = async () => {
    try {
        const result = await prisma.user.findUnique({
            where : {
                id : 11
            },
            rejectOnNotFound : true
        })
    
        if(!result) throw new Error('User not found.')
    
        console.log(result)
    } catch(e) {
        console.log('Encontre un error!', e)
    }
}

const deleteUserAndCompareComments = async () => {
    const comments = await prisma.comment.findMany({
        include : {
            author : true
        }
    })

    console.log(comments)

    const deletedUser = await prisma.user.delete({
        where : {
            id : 1
        },
        include : {
            comments : true
        }
    })

    const newComments = await prisma.comment.findMany({
        include : {
            author : true
        }
    })

    console.log(newComments)
}

const createUserAndPost = async () => {
    const user = await prisma.user.create({
        data : {
            id : "ID1",
            name : "AldoTest1",
            email : "1@test.com",
            posts : {
                create : [{
                    id : "ID1",
                    title : "TestPost1",
                    body : "Testing",
                    published : true
                },
                {
                    id : "ID2",
                    title : "TestPost2",
                    body : "Testing",
                    published : false
                }]
            }
        },
        include : {
            posts : true
        }
    })
    console.log(user)
}

const deleteUser = async () => {
    try {
        await prisma.user.delete({
            where : {
                id : "ID1"
            } 
        })
        const posts = await prisma.post.findMany()
        console.log(posts)
    } catch(e) {
        console.log(`Error! -> ${e}`)
    } 
}

const deletePosts = async () => {
    try {
        const deletedPosts = await prisma.post.deleteMany()
        console.log(deletedPosts)
    } catch (e) {
        console.log(`Error! ${e}`)
    }
}

createComment = async () => {
    try {
        const comment = await prisma.comment.create({
            data : {
                id : "ABC9",
                text : "HolatestingHola",
                postId : "ABCDE",
                authorId : "4946b1b8-c78a-417a-a0df-47b8ad11dfed"
            }
        })
        console.log(comment)
    } catch (e) {
        console.log(`Error! ${e}`)
    }
}

createComment().catch(e => {
    throw e
}).finally(
    async () => {
        prisma.$disconnect()
    }
)