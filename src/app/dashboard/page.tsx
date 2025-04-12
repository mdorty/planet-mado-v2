// src/app/dashboard/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/authOptions'

type Character = {
  id: string;
  name: string;
  race: string;
  currentPowerlevel: number;
  basePowerlevel: number;
}

type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    redirect('/login')
  }
  
  const user = session.user as SessionUser
  if (!user.id) {
    redirect('/login')
  }

  // Fetch user's characters
  const characters = await prisma.character.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      race: true,
      currentPowerlevel: true,
      basePowerlevel: true,
    }
  }) as Character[]
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Your Characters
        </h1>
        <Link 
          href="/character/create" 
          className="btn btn-primary"
        >
          Create Character
        </Link>
      </div>
      
      {characters.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
            You don&apos;t have any characters yet. Start your journey by creating your first character!
          </p>
          <Link 
            href="/character/create" 
            className="btn btn-primary inline-block"
          >
            Create Your First Character
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
              <div className="card card-hover p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                    {character.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{character.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{character.race}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Power Level</span>
                    <span className="font-medium">{new Intl.NumberFormat().format(character.currentPowerlevel)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Level</span>
                    <span className="font-medium">{calculateLevel(character.currentPowerlevel)}</span>
                  </div>
                  
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                          Power Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block">
                          {Math.min(100, Math.round((character.currentPowerlevel / character.basePowerlevel) * 100))}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/20">
                      <div 
                        className="bg-primary rounded transition-all duration-500 ease-out"
                        style={{ 
                          width: `${Math.min(100, Math.round((character.currentPowerlevel / character.basePowerlevel) * 100))}%` 
                        }}
                      ></div>
                    </div>
                  </div>
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