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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user || !character) {
      setError('User not authenticated or character data missing')
      return
    }

    try {
      await updateCharacter.mutateAsync({
        id,
        data: character
      })
    } catch (err) {
      // Error will be handled by onError callback
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (!character) return

    const updatedValue = name === 'basePowerlevel' ? parseInt(value) : value
    const updatedCharacter = {
      ...character,
      [name]: updatedValue
    }

    // Update the query cache with the new values
    // Note: We'll need to use queryClient to update the cache properly
    queryClient.setQueryData(['characters', 'getById', id], updatedCharacter)
  }

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null
  }

  if (!character) {
    return <div>Character not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Character</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-black">Name</label>
          <input
            type="text"
            name="name"
            value={character?.name || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black">Race</label>
          <input
            type="text"
            name="race"
            value={character?.race || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black">Planet</label>
          <input
            type="text"
            name="planet"
            value={character?.planet || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black">Base Power Level</label>
          <input
            type="number"
            name="basePowerlevel"
            value={character?.basePowerlevel || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black">Description</label>
          <textarea
            name="description"
            value={character?.description || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateCharacter.isPending}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {updateCharacter.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
