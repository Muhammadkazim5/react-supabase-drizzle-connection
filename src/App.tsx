import { useState, useEffect } from 'react'
import { dbOperations } from './lib/db'
import './App.css'

type NewUser = {
  name: string;
  email: string;
}

type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [usersList, setUsersList] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<NewUser>({ name: '', email: '' })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string>('')


  // Fetch users from database
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const result = await dbOperations.getUsers()
      setUsersList(result)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    // Basic validation
    if (!formData.name.trim()) {
      setFormError('Name is required')
      return
    }
    if (!formData.email.trim()) {
      setFormError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address')
      return
    }

    setFormLoading(true)
    try {
      await dbOperations.createUser({
        name: formData.name.trim(),
        email: formData.email.trim()
      })
      await fetchUsers() // Refresh the list
      setFormData({ name: '', email: '' }) // Reset form
    } catch (error) {
      console.error('Error creating user:', error)
      setFormError(error instanceof Error ? error.message : 'Failed to create user')
    } finally {
      setFormLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormError('') // Clear error when user starts typing
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      <h1>React + Supabase + Drizzle</h1>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <h3>Create New User</h3>
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={formLoading}
                style={{
                  padding: '8px',
                  marginRight: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '200px'
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={formLoading}
                style={{
                  padding: '8px',
                  marginRight: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '200px'
                }}
              />
              <button
                type="submit"
                disabled={formLoading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: formLoading ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: formLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {formLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
            {formError && (
              <p style={{ color: 'red', margin: '5px 0' }}>{formError}</p>
            )}
          </form>

          <button onClick={fetchUsers} disabled={loading} style={{ marginLeft: '10px' }}>
            {loading ? 'Loading...' : 'Refresh Users'}
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Users ({usersList.length})</h3>
          {usersList.length > 0 ? (
            <ul>
              {usersList.map((user) => (
                <li key={user.id}>
                  {user.name} - {user.email} (Created: {new Date(user.createdAt).toLocaleDateString()})
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found. Create one above!</p>
          )}
        </div>
      </div>
    </>
  )
}

export default App
