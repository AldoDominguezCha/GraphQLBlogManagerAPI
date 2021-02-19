const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export { prisma as default }

