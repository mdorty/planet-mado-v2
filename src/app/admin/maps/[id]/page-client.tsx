"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MapGrid from "@/components/MapGrid";
import { GameMap, Tile, TileType } from "@/types/map";

const tileTypes: TileType[] = [
  "grass",
  "forest",
  "beach",
  "water",
  "mountain",
  "town",
  "road",
  "snake way",
  "building",
  "desert",
  "plains",
  "cave",
  "sky",
  "blank",
];

interface MapDetailProps {
  id: string;
}

export default function MapDetailClient({ id }: MapDetailProps) {
  const router = useRouter();
  const isNew = id === "new";
  
  const [map, setMap] = useState<GameMap>({
    name: "",
    gravityMultiplier: 1.0,
    exits: [],
    tiles: [],
  });
  const [isLoading, setIsLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMap = async () => {
      if (isNew) return;
      
      try {
        const response = await fetch(`/api/maps/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch map');
        }
        const data = await response.json();
        setMap(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching map:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMap();
  }, [id, isNew]);

  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [editMode, setEditMode] = useState<"tile" | "exit" | "building">("tile");
  const [selectedTileType, setSelectedTileType] = useState<TileType>(tileTypes[0]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(isNew ? `/api/maps` : `/api/maps/${id}`, {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(map),
      });

      if (!response.ok) {
        throw new Error('Failed to save map');
      }

      router.replace('/admin/maps');
    } catch (err) {
      alert('Failed to save map');
      console.error('Error saving map:', err);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Loading map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-gray-800">{isNew ? "Create Map" : "Edit Map"}</div>
        <div className="space-x-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`${isSaving ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded flex items-center gap-2`}>
            {isSaving ? 'Saving...' : 'Save Map'}
          </button>
          <button
            onClick={() => router.push("/admin/maps")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Map Properties */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Map Properties</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={map.name}
                onChange={(e) => setMap({ ...map, name: e.target.value })}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gravity Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                value={map.gravityMultiplier}
                onChange={(e) =>
                  setMap({ ...map, gravityMultiplier: parseFloat(e.target.value) })
                }
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Edit Mode Selection */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Edit Mode</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setEditMode("tile")}
              className={`px-4 py-2 rounded ${
                editMode === "tile"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Tile
            </button>
            <button
              onClick={() => setEditMode("exit")}
              className={`px-4 py-2 rounded ${
                editMode === "exit"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Exit
            </button>
            <button
              onClick={() => setEditMode("building")}
              className={`px-4 py-2 rounded ${
                editMode === "building"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Building
            </button>
          </div>
        </div>

        {/* Tile Properties */}
        {selectedTile && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Tile Properties</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tile Type
                </label>
                <select
                  value={selectedTile.tileType}
                  onChange={(e) => {
                    // TODO: Update tile type
                  }}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                >
                  {tileTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={selectedTile.description || ""}
                  onChange={(e) => {
                    // TODO: Update description
                  }}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tile Type Selection */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Tile Types</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {tileTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedTileType(type)}
              className={`p-2 rounded ${
                selectedTileType === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Map Grid */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Map Grid</h2>
        <MapGrid
          tiles={map.tiles}
          editMode={editMode}
          selectedTileType={selectedTileType}
          onTileClick={(tile) => setSelectedTile(tile)}
          onUpdateTile={(tile) => {
            const existingTileIndex = map.tiles.findIndex(
              (t) => t.x === tile.x && t.y === tile.y
            );

            const newTiles = [...map.tiles];
            if (existingTileIndex >= 0) {
              newTiles[existingTileIndex] = {
                ...newTiles[existingTileIndex],
                ...tile,
              };
            } else {
              newTiles.push(tile);
            }

            setMap({ ...map, tiles: newTiles });
          }}
        />
      </div>
    </div>
  );
}
