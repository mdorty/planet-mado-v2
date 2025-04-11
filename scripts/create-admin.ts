import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
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
