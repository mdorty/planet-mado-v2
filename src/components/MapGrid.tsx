import { useState } from "react";
import { Tile, TileType } from "@/types/map";

interface MapGridProps {
  tiles: Tile[];
  editMode: "tile" | "exit" | "building";
  selectedTileType: TileType;
  onTileClick: (tile: Tile) => void;
  onUpdateTile: (tile: Tile) => void;
}

const tileColors: Record<TileType, string> = {
  grass: "bg-green-300",
  forest: "bg-green-700",
  beach: "bg-yellow-200",
  water: "bg-blue-400",
  mountain: "bg-gray-600",
  town: "bg-orange-300",
  road: "bg-gray-400",
  "snake way": "bg-purple-400",
  building: "bg-red-400",
  desert: "bg-yellow-600",
  plains: "bg-green-200",
  cave: "bg-gray-800",
  sky: "bg-blue-200",
  blank: "bg-white",
};

export default function MapGrid({
  tiles,
  editMode,
  selectedTileType,
  onTileClick,
  onUpdateTile,
}: MapGridProps) {
  const [gridSize, setGridSize] = useState({ width: 20, height: 20 });
  const [isDragging, setIsDragging] = useState(false);

  // Find the tile at specific coordinates
  const getTileAt = (x: number, y: number) => {
    return tiles.find((tile) => tile.x === x && tile.y === y);
  };

  // Handle mouse events for drag-to-paint functionality
  const handleMouseDown = (x: number, y: number) => {
    setIsDragging(true);
    handleTileInteraction(x, y);
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isDragging) {
      handleTileInteraction(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle tile interactions based on edit mode
  const handleTileInteraction = (x: number, y: number) => {
    const existingTile = getTileAt(x, y);

    if (editMode === "tile") {
      const newTile: Tile = {
        ...(existingTile || {}),
        x,
        y,
        tileType: selectedTileType,
        isBuilding: selectedTileType === "building",
      };
      onUpdateTile(newTile);
    } else if (existingTile) {
      onTileClick(existingTile);
    }
  };

  return (
    <div 
      className="relative overflow-auto p-4 bg-gray-100 rounded"
      onMouseLeave={() => setIsDragging(false)}
      onMouseUp={handleMouseUp}
    >
      <div className="flex mb-4 space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Width</label>
          <input
            type="number"
            min="1"
            max="50"
            value={gridSize.width}
            onChange={(e) =>
              setGridSize({ ...gridSize, width: parseInt(e.target.value) || 1 })
            }
            className="mt-1 block w-20 rounded border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Height</label>
          <input
            type="number"
            min="1"
            max="50"
            value={gridSize.height}
            onChange={(e) =>
              setGridSize({ ...gridSize, height: parseInt(e.target.value) || 1 })
            }
            className="mt-1 block w-20 rounded border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div 
        className="grid gap-px bg-gray-300 p-px"
        style={{
          gridTemplateColumns: `repeat(${gridSize.width}, 32px)`,
          width: "fit-content"
        }}
      >
        {Array.from({ length: gridSize.height }, (_, y) =>
          Array.from({ length: gridSize.width }, (_, x) => {
            const tile = getTileAt(x, y);
            return (
              <div
                key={`${x}-${y}`}
                className={`w-8 h-8 ${
                  tile ? tileColors[tile.tileType as TileType] : "bg-white"
                } hover:opacity-75 cursor-pointer relative`}
                onMouseDown={() => handleMouseDown(x, y)}
                onMouseEnter={() => handleMouseEnter(x, y)}
              >
                {tile?.isBuilding && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs">🏠</span>
                  </div>
                )}
                {editMode === "exit" && tile?.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs">⭐</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
