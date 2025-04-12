'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { trpc } from '@/utils/trpc'

type User = {
  id: string
  name: string | null
  email: string | null
}

type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export default function NewCharacterPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    race: '',
    planet: '',
    basePowerlevel: 100,
    description: '',
    userId: '',
  })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/admin/login')
    return null
  }

  const { data: users } = trpc.users.list.useQuery(undefined, {
    enabled: session?.user?.isAdmin
  })

  const createCharacter = trpc.characters.create.useMutation({
    onSuccess: () => {
      router.push('/admin')
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!session?.user) {
      setError('User not authenticated')
      setLoading(false)
      return
    }

    try {
      await createCharacter.mutateAsync({
        ...formData,
        userId: session.user.isAdmin ? formData.userId : session.user.id
      })
    } catch (err) {
      // Error will be handled by onError callback
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'basePowerlevel' ? parseInt(value) : value
    }))
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create New Character</h1>
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
        {session?.user?.isAdmin && (
          <div>
            <label className="block text-sm font-bold text-gray-700">User Account</label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="">Select a user</option>
              {users?.map((user: User) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-bold text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-2 block w-full rounded border p-2 text-black bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Race</label>
          <select
            name="race"
            value={formData.race}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select a race</option>
            <option value="Human">Human</option>
            <option value="Saiyan">Saiyan</option>
            <option value="Namekian">Namekian</option>
            <option value="Majin">Majin</option>
            <option value="Frieza Race">Frieza Race</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Planet</label>
          <input
            type="text"
            name="planet"
            value={formData.planet}
            onChange={handleChange}
            className="mt-2 block w-full rounded border p-2 text-black bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Base Power Level</label>
          <input
            type="number"
            name="basePowerlevel"
            value={formData.basePowerlevel}
            onChange={handleChange}
            required
            min="1"
            className="mt-2 block w-full rounded border p-2 text-black bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-2 block w-full rounded border p-2 text-black bg-white"
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
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Character'}
          </button>
        </div>
      </form>
    </div>
  )
}
