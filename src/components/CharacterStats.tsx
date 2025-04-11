// src/components/CharacterStats.tsx
import { type Character, type WeightedClothing } from '@prisma/client'

type CharacterWithRelations = Character & {
  weightedClothing: WeightedClothing | null
}

interface CharacterStatsProps {
  character: CharacterWithRelations
}

export default function CharacterStats({ character }: CharacterStatsProps) {
  // Calculate power level percentage
  const percentage = Math.round((character.currentPowerlevel / character.basePowerlevel) * 100)
  const circleCircumference = 440
  const strokeDashoffset = circleCircumference - (circleCircumference * percentage / 100)
  
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Power Level Display */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-center">Powerlevel</h3>
        
        <div className="relative max-w-[150px] max-h-[150px] mx-auto">
          <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 150 150">
            <circle 
              className="fill-none stroke-gray-200" 
              cx="75" 
              cy="75" 
              r="70" 
              strokeWidth="8"
            />
            <circle 
              className="fill-none stroke-green-500 stroke-round transition-all duration-500 ease-in-out" 
              cx="75" 
              cy="75" 
              r="70" 
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-800">
            {percentage}%
          </div>
        </div>
        
        <p className="text-center mt-4">
          {character.hiddenPowerlevel && (
            <>
              {new Intl.NumberFormat().format(character.hiddenPowerlevel)} (
            </>
          )}
          <span id="current-powerlevel">
            {new Intl.NumberFormat().format(character.currentPowerlevel)}
          </span>
          {character.hiddenPowerlevel && ")"}
          {" / "}
          {new Intl.NumberFormat().format(character.basePowerlevel)}
        </p>
      </div>
      
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-center">Basic Info</h3>
        
        <p><strong>Race:</strong> {character.race}</p>
        {character.planet && <p><strong>Planet:</strong> {character.planet}</p>}
        <p><strong>Alignment:</strong> {character.alignment > 0 ? '+' : ''}{character.alignment}</p>
        <p><strong>Ability Count:</strong> {character.abilityCount}</p>
        
        {/* Weighted Clothing Bonus */}
        {character.weightedClothing && character.weightedClothing.bonusPercent > 0 && (
          <div className="mt-4">
            <p><strong>Weighted Clothing:</strong></p>
            <p>
              +<span id="weighted-bonus">{character.weightedClothing.bonusPercent}%</span> to powerlevel gains<br />
              -<span id="weighted-bonus">{character.weightedClothing.bonusPercent}%</span> to dodge<br />
              +<span id="weighted-bonus">{character.weightedClothing.bonusPercent}%</span> to opponent's dodge
            </p>
          </div>
        )}
      </div>
      
      {/* People You've Been To */}
      {character.peopleMet && character.peopleMet !== "None" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-center">People You've Been To</h3>
          <p>{character.peopleMet}</p>
        </div>
      )}
      
      {/* Jobs */}
      {character.jobs && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-center">Jobs</h3>
          <p>{character.jobs}</p>
        </div>
      )}
      
      {/* Description */}
      {character.description && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-center">Description</h3>
          <p>{character.description}</p>
        </div>
      )}
    </div>
  )
}