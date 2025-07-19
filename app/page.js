'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import SearchBar from '@/components/SearchBar'
import FilterDropdown from '@/components/FilterDropdown'
import EmployeeCard from '@/components/EmployeeCard'
import useStore from '@/store/useStore'
import useSearch from '@/hooks/useSearch'
import { getRandomDepartment, getRandomRating } from '@/lib/utils'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const setUsers = useStore(state => state.setUsers)
  const { getFilteredUsers } = useSearch()
  const users = getFilteredUsers()
  
  useEffect(() => {
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
  }, [setUsers])
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Employee Performance Dashboard
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar />
            </div>
            <FilterDropdown />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No employees found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <EmployeeCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}