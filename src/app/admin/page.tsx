'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Character } from '@/types/character'
import { trpc } from '@/utils/trpc'
import { useQueryClient } from '@tanstack/react-query'
import { UserManagement } from '@/components/UserManagement'

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
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; character: Character | null }>({ 
    isOpen: false, 
    character: null 
  })
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: characters = [], isLoading, error } = trpc.characters.list.useQuery(undefined, {
    enabled: status === 'authenticated',
    retry: false
  })

  const deleteCharacter = trpc.characters.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch the characters list
      queryClient.invalidateQueries({ queryKey: [['characters', 'list']] })
      setDeleteModal({ isOpen: false, character: null })
    },
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  const handleDelete = async (character: Character): Promise<void> => {
    try {
      await deleteCharacter.mutateAsync(character.id)
    } catch (error) {
      console.error('Error deleting character:', error)
    }
  }

  if (status === 'loading' || isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/admin/login')
    return null
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">User Management</h2>
          <UserManagement />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Character Management</h2>
          <DeleteConfirmationModal
            isOpen={deleteModal.isOpen}
            characterName={deleteModal.character?.name || ''}
            onConfirm={() => deleteModal.character && handleDelete(deleteModal.character)}
            onCancel={() => setDeleteModal({ isOpen: false, character: null })}
          />
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Characters</h1>
            <button
              onClick={() => router.push('/admin/characters/new')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Character
            </button>
          </div>
          <div className="bg-white rounded p-6 shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b-2 text-left text-sm font-bold text-gray-900 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 border-b-2 text-left text-sm font-bold text-gray-900 uppercase">
                      Race
                    </th>
                    <th className="px-6 py-3 border-b-2 text-left text-sm font-bold text-gray-900 uppercase">
                      Power Level
                    </th>
                    <th className="px-6 py-3 border-b-2 text-left text-sm font-bold text-gray-900 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {characters.map((character: Character) => (
                    <tr key={character.id} className="border-b border-gray-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {character.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {character.race}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {character.currentPowerlevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-4">
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
        </section>
      </div>
    </div>
  )
}
