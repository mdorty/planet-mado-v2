// components/CharacterInventory.tsx
import { type Character, type Item } from '@prisma/client'

type CharacterWithInventory = Character & {
  inventory: Item[]
}

interface CharacterInventoryProps {
  character: CharacterWithInventory
}

export default function CharacterInventory({ character }: CharacterInventoryProps) {
  // Get equipped items
  const equippedItems = character.inventory.filter(item => item.equipped)
  
  // Get unequipped items (in bag)
  const bagItems = character.inventory.filter(item => !item.equipped)
  
  // Only render the component if there are any items
  if (character.inventory.length === 0) {
    return null
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-center">Items</h3>
      
      {/* Equipped Items */}
      {equippedItems.length > 0 && (
        <div className="mb-4">
          <p className="font-bold mb-2">Equipped:</p>
          <ul className="list-disc pl-5">
            {equippedItems.map(item => (
              <li key={item.id} className="mb-1">
                {item.name}
                {item.condition && <span className="text-sm text-gray-600"> (Condition: {item.condition}%)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Bag Items */}
      {bagItems.length > 0 && (
        <div>
          <p className="font-bold mb-2">Bag:</p>
          <ul className="list-disc pl-5">
            {bagItems.map(item => (
              <li key={item.id} className="mb-1">
                {item.name}
                {item.condition && <span className="text-sm text-gray-600"> (Condition: {item.condition}%)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}