import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, race, planet, basePowerlevel, description, userId } = await request.json()

    // Validate required fields
    if (!name || !race || !basePowerlevel || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the character
    const character = await prisma.character.create({
      data: {
        name,
        race,
        planet: planet || null,
        basePowerlevel,
        currentPowerlevel: basePowerlevel,
        description: description || null,
        userId,
      },
    })

    return NextResponse.json(character)
  } catch (error) {
    console.error('Error creating character:', error)
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const characters = await prisma.character.findMany({
      select: {
        id: true,
        name: true,
        race: true,
        currentPowerlevel: true,
        basePowerlevel: true,
        planet: true,
        alignment: true,
      },
    })
    return NextResponse.json(characters)
  } catch (error) {
    console.error('Error fetching characters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    )
  }
}
