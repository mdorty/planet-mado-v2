"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { GameMap } from "@/types/map";
import { useEffect, useState } from "react";

export default function MapEditor() {
  const router = useRouter();
  const [maps, setMaps] = useState<GameMap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const response = await fetch('/api/maps');
        if (!response.ok) {
          throw new Error('Failed to fetch maps');
        }
        const data = await response.json();
        setMaps(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaps();
  }, []);

  const handleDelete = async (mapId: string | undefined) => {
    if (!mapId) return;
    if (!confirm('Are you sure you want to delete this map? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/maps/${mapId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete map');
      }

      setMaps(maps.filter(map => map.id !== mapId));
    } catch (err) {
      alert('Failed to delete map');
      console.error('Error deleting map:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Loading maps...</div>
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
        <h1 className="text-2xl font-bold text-gray-800">Map Management</h1>
        <Link 
          href="/admin/maps/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Create New Map
        </Link>
      </div>

      <div className="grid gap-4">
        {maps?.map((map: GameMap) => (
          <div key={map.id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <div className="text-xl font-semibold text-gray-800">{map.name}</div>
              <p className="text-gray-600">Gravity Multiplier: {map.gravityMultiplier}</p>
              <p className="text-gray-600">Tiles: {map.tiles?.length || 0}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/maps/${map.id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                Edit
              </Link>
              <button
                onClick={() => handleDelete(map.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}
