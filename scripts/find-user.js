const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function findUser(email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    console.log('User found:', JSON.stringify(user, null, 2))
  } catch (error) {
    console.error('Error finding user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get the email from command line argument
const email = process.argv[2]
if (!email) {
  console.error('Please provide an email address')
  process.exit(1)
}

findUser(email)
