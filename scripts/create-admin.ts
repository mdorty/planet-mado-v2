import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@planetmado.com',
        isAdmin: true
      },
    })
    console.log('Admin created:', admin)
  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
