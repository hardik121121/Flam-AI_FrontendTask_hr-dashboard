'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import EmployeeCard from '@/components/EmployeeCard'
import Button from '@/components/Button'
import useBookmarks from '@/hooks/useBookmarks'
import useStore from '@/store/useStore'
import { getRandomDepartment, getRandomRating } from '@/lib/utils'

export default function Bookmarks() {
  const [loading, setLoading] = useState(true)
  const { getBookmarkedUsers, removeBookmark } = useBookmarks()
  const setUsers = useStore(state => state.setUsers)
  const users = useStore(state => state.users)
  const bookmarkedUsers = getBookmarkedUsers()
  
  useEffect(() => {
    if (users.length === 0) {
      const fetchUsers = async () => {
        try {
          const response = await fetch('https://dummyjson.com/users?limit=20')
          const data = await response.json()
          
          const enrichedUsers = data.users.map(user => ({
            ...user,
            department: getRandomDepartment(),
            rating: getRandomRating()
          }))
          
          setUsers(enrichedUsers)
          setLoading(false)
        } catch (error) {
          console.error('Error fetching users:', error)
          setLoading(false)
        }
      }
      
      fetchUsers()
    } else {
      setLoading(false)
    }
  }, [users.length, setUsers])
  
  const handleAssignToProject = (userId) => {
    alert(`Assigning employee ${userId} to a new project`)
  }
  
  const handlePromote = (userId) => {
    alert(`Promoting employee ${userId}`)
  }
  
  const handleRemoveAll = () => {
    if (confirm('Are you sure you want to remove all bookmarks?')) {
      bookmarkedUsers.forEach(user => removeBookmark(user.id))
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bookmarked Employees ({bookmarkedUsers.length})
            </h2>
            {bookmarkedUsers.length > 0 && (
              <Button variant="danger" size="sm" onClick={handleRemoveAll}>
                Remove All
              </Button>
            )}
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : bookmarkedUsers.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <p className="mt-4 text-gray-500 dark:text-gray-400">No bookmarked employees yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Go to the dashboard and bookmark employees to see them here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedUsers.map(user => (
                  <div key={user.id} className="relative">
                    <EmployeeCard user={user} />
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAssignToProject(user.id)}
                      >
                        Assign to Project
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => handlePromote(user.id)}
                      >
                        Promote
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}