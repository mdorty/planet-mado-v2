const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin(email, password, name = 'Admin') {
  if (!email || !password) {
    console.error('Email and password are required')
    return
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12)

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin: true
      },
    })
    console.log('Admin created:', { ...admin, password: '[HIDDEN]' })
  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get command line arguments
const email = process.argv[2]
const password = process.argv[3]
const name = process.argv[4]

if (!email || !password) {
  console.log('Usage: node create-admin.js <email> <password> [name]')
  process.exit(1)
}

createAdmin(email, password, name)
