'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { trpc } from '@/utils/trpc'
import { useQueryClient } from '@tanstack/react-query'
import type { Character } from '@/types/character'

export default function EditCharacterForm({ id }: { id: string }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [editableCharacter, setEditableCharacter] = useState<Character | null>(null)

  const { data: character, isLoading } = trpc.characters.getById.useQuery(id, {
    enabled: status === 'authenticated',
    retry: false
  })

  const updateCharacter = trpc.characters.update.useMutation({
    onSuccess: () => {
      router.push('/admin')
    },
    onError: (err) => {
      setError(err.message)
    }
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (character) {
      setEditableCharacter(character)
    }
  }, [character])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user || !editableCharacter) {
      setError('User not authenticated or character data missing')
      return
    }

    try {
      await updateCharacter.mutateAsync({
        id,
        data: editableCharacter
      })
    } catch (err) {
      // Error will be handled by onError callback
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (!editableCharacter) return

    const updatedValue = name === 'basePowerlevel' ? parseInt(value) : value
    setEditableCharacter({
      ...editableCharacter,
      [name]: updatedValue
    })
  }

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null
  }

  if (!editableCharacter) {
    return <div>Character not found</div>
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Character</h1>
        <button
          onClick={() => router.push('/admin')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg p-6 shadow-sm">
        <div>
          <label className="block text-sm font-bold text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={editableCharacter?.name || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Race</label>
          <input
            type="text"
            name="race"
            value={editableCharacter?.race || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Planet</label>
          <input
            type="text"
            name="planet"
            value={editableCharacter?.planet || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Base Power Level</label>
          <input
            type="number"
            name="basePowerlevel"
            value={editableCharacter?.basePowerlevel || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Description</label>
          <textarea
            name="description"
            value={editableCharacter?.description || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.push('/admin')}
            type="button"
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={updateCharacter.isPending}
          >
            {updateCharacter.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
