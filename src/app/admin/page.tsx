'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Character } from '@/types/character'
import { trpc } from '@/utils/trpc'
import { useQueryClient } from '@tanstack/react-query'
import { UserManagement } from '@/components/UserManagement'
import Link from 'next/link'

type DeleteModalProps = {
  isOpen: boolean
  characterName: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteConfirmationModal({ isOpen, characterName, onConfirm, onCancel }: DeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4 text-black">Delete Character</h3>
        <p className="mb-6 text-gray-700">
          Are you sure you want to delete {characterName}? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/admin/login')
    },
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; character: Character | null }>({ 
    isOpen: false, 
    character: null 
  })
  const { data, isLoading, error, refetch } = trpc.characters.list.useQuery(
    { limit: 20, search: searchTerm || undefined },
    { enabled: !!session?.user?.isAdmin }
  )
  const characters = data?.items || []

  const deleteCharacter = trpc.characters.delete.useMutation({
    onSuccess: () => {
      refetch()
      setDeleteModal({ isOpen: false, character: null })
    },
  })

  const handleDelete = async (character: Character): Promise<void> => {
    try {
      await deleteCharacter.mutateAsync(character.id)
    } catch (error) {
      console.error('Error deleting character:', error)
    }
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!session?.user?.isAdmin) {
    return null
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>
  }

  return (
    <div className="p-6 space-y-8 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">User Management</h2>
          <UserManagement />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Map Management</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <p className="text-gray-600">Create and manage game maps, including tiles, buildings, and exits.</p>
            </div>
            <button
              onClick={() => router.push('/admin/maps')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Manage Maps
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Character Management</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search characters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border rounded-md bg-gray-50 text-gray-800 placeholder-gray-500"
                />
              </div>
              <Link
                href="/admin/characters/new"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create Character
              </Link>
            </div>
            <div className="bg-white rounded p-6 shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b-2 text-left text-sm font-bold text-gray-800 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 border-b-2 text-left text-sm font-bold text-gray-800 uppercase">
                        User
                      </th>
                      <th className="px-6 py-3 border-b-2 text-left text-sm font-bold text-gray-800 uppercase">
                        Race
                      </th>
                      <th className="px-6 py-3 border-b-2 text-left text-sm font-bold text-gray-800 uppercase">
                        Power Level
                      </th>
                      <th className="px-6 py-3 border-b-2 text-left text-sm font-bold text-gray-800 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {characters?.map((character: Character) => (
                      <tr key={character.id} className="border-b border-gray-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {character.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {character.user?.name}
                          {character.user?.email && (
                            <span className="block text-xs text-gray-500">
                              {character.user.email}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {character.race}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {character.currentPowerlevel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 space-x-4">
                          <button
                            onClick={() => router.push(`/admin/characters/${character.id}`)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, character })}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        characterName={deleteModal.character?.name || ''}
        onConfirm={() => deleteModal.character && handleDelete(deleteModal.character)}
        onCancel={() => setDeleteModal({ isOpen: false, character: null })}
      />
    </div>
  )
}
