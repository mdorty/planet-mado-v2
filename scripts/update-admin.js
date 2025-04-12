const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateAdmin(userId) {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        isAdmin: true
      }
    })
    console.log('User updated:', user)
  } catch (error) {
    console.error('Error updating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get the user ID from command line argument
const userId = process.argv[2]
if (!userId) {
  console.error('Please provide a user ID')
  process.exit(1)
}

updateAdmin(userId)
