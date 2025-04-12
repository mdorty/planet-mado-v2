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
}

interface CharacterStatsProps {
  character: Character
}

export default function CharacterStats({ character }: CharacterStatsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Character Stats</h2>
      
      <div className="space-y-4">
        <div>
          <p><strong>Name:</strong> {character.name}</p>
          <p><strong>Race:</strong> {character.race}</p>
          {character.planet && <p><strong>Planet:</strong> {character.planet}</p>}
        </div>

        <div>
          <p><strong>Base Power Level:</strong> {character.basePowerlevel.toLocaleString()}</p>
          <p><strong>Current Power Level:</strong> {character.currentPowerlevel.toLocaleString()}</p>
          {character.hiddenPowerlevel && (
            <p><strong>Hidden Power Level:</strong> {character.hiddenPowerlevel.toLocaleString()}</p>
          )}
        </div>

        <div>
          <p><strong>Alignment:</strong> {character.alignment}</p>
          <p><strong>Abilities:</strong> {character.abilityCount}</p>
        </div>

        {character.description && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{character.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}