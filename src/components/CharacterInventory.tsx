// src/components/CharacterInventory.tsx
interface InventoryItem {
  id: string
  name: string
  description: string
  quantity: number
  characterId: string
}

interface Character {
  id: string
  name: string
  inventory: InventoryItem[]
}

interface CharacterInventoryProps {
  character: Character
}

export default function CharacterInventory({ character }: CharacterInventoryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Inventory</h2>
      
      {character.inventory.length > 0 ? (
        <div className="space-y-4">
          {character.inventory.map((item) => (
            <div key={item.id} className="border-b pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                  x{item.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No items in inventory</p>
      )}
    </div>
  )
}