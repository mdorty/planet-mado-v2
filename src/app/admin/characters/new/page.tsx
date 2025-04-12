'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { trpc } from '@/utils/trpc'

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
  })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/admin/login')
    return null
  }

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
        userId: (session.user as SessionUser).id
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Create New Character</h1>
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

      <form onSubmit={handleSubmit} className="mt-6 space-y-6 bg-white rounded p-6 shadow">
        <div>
          <label className="block text-sm font-bold text-black">Name</label>
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
          <label className="block text-sm font-bold text-black">Race</label>
          <select
            name="race"
            value={formData.race}
            onChange={handleChange}
            required
            className="mt-2 block w-full rounded border p-2 text-black bg-white"
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
          <label className="block text-sm font-bold text-black">Planet</label>
          <input
            type="text"
            name="planet"
            value={formData.planet}
            onChange={handleChange}
            className="mt-2 block w-full rounded border p-2 text-black bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black">Base Power Level</label>
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
          <label className="block text-sm font-bold text-black">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-2 block w-full rounded border p-2 text-black bg-white"
          />
        </div>



        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Character'}
          </button>
        </div>
      </form>
    </div>
  )
}
