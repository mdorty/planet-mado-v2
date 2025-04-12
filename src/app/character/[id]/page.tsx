// src/app/character/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { redirect, notFound } from 'next/navigation'
import CharacterStats from '@/components/CharacterStats'
import CharacterInventory from '@/components/CharacterInventory'
import CharacterAttacks from '@/components/CharacterAttacks'
import { authOptions } from '@/app/api/authOptions'
import { Session } from 'next-auth'

interface Character {
  id: string
  name: string
  race: string
  planet?: string | null
  alignment: number
  basePowerlevel: number
  currentPowerlevel: number
  hiddenPowerlevel?: number | null
  description?: string | null
  createdAt: Date
  updatedAt: Date
  lastDeath?: Date | null
  deathCount: number
  lastDateTrained?: Date | null
  lastDateMeditated?: Date | null
  peopleMet?: string | null
  jobs?: string | null
  abilityCount: number
  userId: string
  inventory: Array<{
    id: string
    name: string
    description: string
    quantity: number
    characterId: string
  }>
  attacks: Array<{
    id: string
    name: string
    description: string
    damage: number
    kiCost: number
    characterId: string
    percentDamage: number
    percentCost: number
    isChargeable: boolean
    isStun: boolean
    stunTurns: number
    stunChancePercent: number
    powerlevelMultiplier: number
    category: 'Physical' | 'Ki' | 'Special'
  }>
  weightedClothing: Array<{
    id: string
    name: string
    weight: number
    characterId: string
  }>
}

interface PageProps {
  params: {
    id: string
  }
}

interface SessionWithUserId extends Session {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    isAdmin?: boolean
  }
}

export default async function CharacterPage({ params }: PageProps) {
  // Ensure params.id is available
  if (!params?.id) {
    notFound()
  }

  const session = (await getServerSession(authOptions)) as SessionWithUserId | null
  
  if (!session?.user) {
    redirect('/login')
  }
  
  // Fetch character with related data
  const character = await prisma.character.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      inventory: true,
      attacks: true,
      weightedClothing: true,
    }
  })

  if (!character) {
    notFound()
  }
  
  // Check if character exists and belongs to the user
  if (!character || character.userId !== session.user.id) {
    redirect('/dashboard')
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{character.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CharacterStats character={character} />
        <CharacterInventory character={character} />
      </div>
      
      <div className="mt-8">
        <CharacterAttacks character={character} />
      </div>
      
      {(character.lastDeath || character.deathCount > 0 || character.lastDateTrained || character.race === "Namekian") && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-center">Misc</h3>
          
          {character.lastDeath && (
            <p><strong>Last Death:</strong> {new Date(character.lastDeath).toLocaleString()}</p>
          )}
          
          {character.deathCount > 0 && (
            <p><strong>Number of Deaths:</strong> {character.deathCount}</p>
          )}
          
          {character.lastDateTrained && (
            <p><strong>Last Date Trained:</strong> {new Date(character.lastDateTrained).toLocaleString()}</p>
          )}
          
          {character.race === "Namekian" && character.lastDateMeditated && (
            <p><strong>Last Date Meditated:</strong> {new Date(character.lastDateMeditated).toLocaleString()}</p>
          )}
        </div>
      )}
    </div>
  )
}