import { useState, useEffect } from 'react'
import { dbOperations } from './lib/db'
import { supabase } from './lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
  const [count, setCount] = useState(0)
  const [usersList, setUsersList] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [formData, setFormData] = useState<NewUser>({ name: '', email: '' })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string>('')

  // Check for authenticated user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

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

  // Sign in with Supabase
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password'
    })
    if (error) console.error('Error signing in:', error)
  }

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React + Supabase + Drizzle</h1>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <h3>Authentication</h3>
          {user ? (
            <div>
              <p>Welcome, {user.email}!</p>
              <button onClick={signOut}>Sign Out</button>
            </div>
          ) : (
            <button onClick={signIn}>Sign In (Demo)</button>
          )}
        </div>

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

        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Connected to Supabase with Drizzle ORM
      </p>
    </>
  )
}

export default App
