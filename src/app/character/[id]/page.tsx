// app/character/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import CharacterStats from '@/components/CharacterStats'
import CharacterInventory from '@/components/CharacterInventory'
import CharacterAttacks from '@/components/CharacterAttacks'

export default async function CharacterPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    redirect('/login')
  }
  
  // Fetch character with related data
  const character = await prisma.character.findUnique({
    where: {
      id: params.id,
    },
    include: {
      inventory: true,
      attacks: true,
      weightedClothing: true,
    }
  })
  
  // Check if character exists and belongs to the user
  if (!character || character.userId !== session.user.id) {
    redirect('/dashboard')
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{character.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CharacterStats character={character} />
        <CharacterInventory character={character} />
      </div>
      
      <div className="mt-6">
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