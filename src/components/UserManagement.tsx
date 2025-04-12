'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/utils/trpc'

type User = {
  id: string
  email: string
  name: string | null
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

type UserFormData = {
  email: string
  name: string
  password: string
  isAdmin: boolean
}

export function UserManagement() {
  const { data: users, isLoading, error, refetch } = trpc.users.list.useQuery(undefined, {
    enabled: true
  })

  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    password: '',
    isAdmin: false,
  })

  const createUser = trpc.users.create.useMutation({
    onSuccess: () => {
      setEditingUser(null)
      setFormData({
        email: '',
        name: '',
        password: '',
        isAdmin: false,
      })
      refetch()
    },
  })

  const updateUser = trpc.users.update.useMutation({
    onSuccess: () => {
      setEditingUser(null)
      setFormData({
        email: '',
        name: '',
        password: '',
        isAdmin: false,
      })
      refetch()
    },
  })

  const deleteUser = trpc.users.delete.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await updateUser.mutateAsync({
          id: editingUser.id,
          ...formData,
        })
      } else {
        await createUser.mutateAsync(formData)
      }
    } catch (err) {
      console.error('Error saving user:', err)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await deleteUser.mutateAsync(userId)
    } catch (err: unknown) {
      console.error('Error deleting user:', err)
      refetch() // refetch users on error
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      name: user.name ?? '',
      password: '',
      isAdmin: user.isAdmin,
    })
  }

  const handleCancel = () => {
    setEditingUser(null)
    setFormData({
      email: '',
      name: '',
      password: '',
      isAdmin: false,
    })
  }



  if (isLoading) {
    return <div className="p-4 text-gray-800">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>
  }

  return (
    <div className="bg-white rounded p-6 shadow">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-800">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800"
            >
              Password {editingUser && '(leave blank to keep current)'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={!editingUser}
              className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label
              htmlFor="isAdmin"
              className="block text-sm font-medium text-gray-700"
            >
              Admin Status
            </label>
            <select
              id="isAdmin"
              name="isAdmin"
              value={formData.isAdmin ? 'true' : 'false'}
              onChange={(e) =>
                setFormData({ ...formData, isAdmin: e.target.value === 'true' })
              }
              className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
            >
              <option value="false">Regular User</option>
              <option value="true">Admin</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          {editingUser && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {editingUser ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="border-b px-6 py-3 text-left text-sm font-bold text-gray-800">
                Email
              </th>
              <th className="border-b px-6 py-3 text-left text-sm font-bold text-gray-800">
                Name
              </th>
              <th className="border-b px-6 py-3 text-left text-sm font-bold text-gray-800">
                Admin
              </th>
              <th className="border-b px-6 py-3 text-left text-sm font-bold text-gray-800">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: User) => (
              <tr key={user.id} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.isAdmin ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    onClick={() => handleEdit(user)}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-700"
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
  )
}
