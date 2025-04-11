// components/CharacterAttacks.tsx
import { useState } from 'react'
import { type Character, type Attack } from '@prisma/client'

type CharacterWithAttacks = Character & {
  attacks: Attack[]
}

interface CharacterAttacksProps {
  character: CharacterWithAttacks
}

export default function CharacterAttacks({ character }: CharacterAttacksProps) {
  const [expandedAttacks, setExpandedAttacks] = useState<string[]>([])

  // Toggle attack expansion
  const toggleAttack = (attackId: string) => {
    setExpandedAttacks(prev => 
      prev.includes(attackId)
        ? prev.filter(id => id !== attackId)
        : [...prev, attackId]
    )
  }

  // Group attacks by category
  const attacksByCategory: Record<string, Attack[]> = {}
  
  character.attacks.forEach(attack => {
    if (!attacksByCategory[attack.category]) {
      attacksByCategory[attack.category] = []
    }
    attacksByCategory[attack.category].push(attack)
  })

  // Only render the component if there are any attacks
  if (character.attacks.length === 0) {
    return null
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-center">Attacks & Abilities</h3>

      {Object.entries(attacksByCategory).map(([category, attacks]) => (
        <div key={category} className="mb-6">
          <h4 className="text-lg font-bold mb-3 border-b pb-1">{category}</h4>

          {/* Two column layout for categories with more than 3 attacks */}
          {attacks.length > 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First column */}
              <div>
                {attacks.slice(0, Math.ceil(attacks.length / 2)).map(attack => (
                  <div key={attack.id} className="mb-4">
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleAttack(attack.id)}
                    >
                      <strong>{attack.name}</strong>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${expandedAttacks.includes(attack.id) ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    
                    {expandedAttacks.includes(attack.id) && (
                      <div className="pl-4 mt-2 text-gray-700">
                        {attack.description && <p className="italic mb-2">{attack.description}</p>}
                        
                        {attack.percentDamage && <p><strong>Damage:</strong> {attack.percentDamage}%</p>}
                        {attack.percentCost && <p><strong>Cost:</strong> {attack.percentCost}%</p>}
                        {attack.isChargeable && <p><strong>Chargeable</strong></p>}
                        
                        {attack.isStun && (
                          <>
                            <p><strong>Stun Turns:</strong> {attack.stunTurns}</p>
                            <p><strong>Stun Chance:</strong> {attack.stunChancePercent}%</p>
                          </>
                        )}
                        
                        {attack.powerlevelMultiplier && (
                          <p><strong>Powerlevel Multiplier:</strong> x{attack.powerlevelMultiplier}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Second column */}
              <div>
                {attacks.slice(Math.ceil(attacks.length / 2)).map(attack => (
                  <div key={attack.id} className="mb-4">
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleAttack(attack.id)}
                    >
                      <strong>{attack.name}</strong>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${expandedAttacks.includes(attack.id) ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    
                    {expandedAttacks.includes(attack.id) && (
                      <div className="pl-4 mt-2 text-gray-700">
                        {attack.description && <p className="italic mb-2">{attack.description}</p>}
                        
                        {attack.percentDamage && <p><strong>Damage:</strong> {attack.percentDamage}%</p>}
                        {attack.percentCost && <p><strong>Cost:</strong> {attack.percentCost}%</p>}
                        {attack.isChargeable && <p><strong>Chargeable</strong></p>}
                        
                        {attack.isStun && (
                          <>
                            <p><strong>Stun Turns:</strong> {attack.stunTurns}</p>
                            <p><strong>Stun Chance:</strong> {attack.stunChancePercent}%</p>
                          </>
                        )}
                        
                        {attack.powerlevelMultiplier && (
                          <p><strong>Powerlevel Multiplier:</strong> x{attack.powerlevelMultiplier}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Single column layout for categories with 3 or fewer attacks
            <div>
              {attacks.map(attack => (
                <div key={attack.id} className="mb-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleAttack(attack.id)}
                  >
                    <strong>{attack.name}</strong>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${expandedAttacks.includes(attack.id) ? 'rotate-90' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  {expandedAttacks.includes(attack.id) && (
                    <div className="pl-4 mt-2 text-gray-700">
                      {attack.description && <p className="italic mb-2">{attack.description}</p>}
                      
                      {attack.percentDamage && <p><strong>Damage:</strong> {attack.percentDamage}%</p>}
                      {attack.percentCost && <p><strong>Cost:</strong> {attack.percentCost}%</p>}
                      {attack.isChargeable && <p><strong>Chargeable</strong></p>}
                      
                      {attack.isStun && (
                        <>
                          <p><strong>Stun Turns:</strong> {attack.stunTurns}</p>
                          <p><strong>Stun Chance:</strong> {attack.stunChancePercent}%</p>
                        </>
                      )}
                      
                      {attack.powerlevelMultiplier && (
                        <p><strong>Powerlevel Multiplier:</strong> x{attack.powerlevelMultiplier}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}