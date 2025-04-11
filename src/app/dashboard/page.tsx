// src/app/dashboard/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/authOptions'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    redirect('/login')
  }
  
  // Fetch user's characters
  const characters = await prisma.character.findMany({
    where: {
      userId: session.user.id as string,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Characters</h1>
      
      {characters.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">You don't have any characters yet.</p>
          <Link 
            href="/character/create" 
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Create a Character
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <Link 
              key={character.id} 
              href={`/character/${character.id}`}
              className="block"
            >
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-bold mb-2">{character.name}</h2>
                <p className="text-gray-600 mb-2">{character.race}</p>
                <div className="flex justify-between">
                  <span>PL: {new Intl.NumberFormat().format(character.currentPowerlevel)}</span>
                  <span>Level: {calculateLevel(character.currentPowerlevel)}</span>
                </div>
                
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, Math.round((character.currentPowerlevel / character.basePowerlevel) * 100))}%` 
                    }}
                  ></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// Simple level calculation function based on power level
function calculateLevel(powerLevel: number): number {
  // This is a basic implementation - you might want to adjust the formula
  return Math.floor(Math.log10(powerLevel) * 5) + 1
}