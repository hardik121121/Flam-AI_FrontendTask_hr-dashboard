'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Card from '@/components/Card'
import Badge from '@/components/Badge'
import RatingBar from '@/components/RatingBar'
import Button from '@/components/Button'
import useBookmarks from '@/hooks/useBookmarks'
import { getRandomDepartment, getRandomRating, getPerformanceColor, generateMockProjects, generatePerformanceHistory } from '@/lib/utils'

export default function EmployeeDetails() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const { toggleBookmark, isBookmarked } = useBookmarks()
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/users/${id}`)
        const data = await response.json()
        
        const enrichedUser = {
          ...data,
          department: getRandomDepartment(),
          rating: getRandomRating(),
          bio: 'Dedicated professional with extensive experience in their field. Known for strong collaboration skills and innovative problem-solving abilities.',
          projects: generateMockProjects(),
          performanceHistory: generatePerformanceHistory(),
          feedback: [
            { author: 'John Manager', date: '2024-03-15', comment: 'Excellent team player with great communication skills.' },
            { author: 'Sarah Lead', date: '2024-02-28', comment: 'Consistently delivers high-quality work on time.' },
            { author: 'Mike Director', date: '2024-01-20', comment: 'Shows great initiative and leadership potential.' }
          ]
        }
        
        setUser(enrichedUser)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user:', error)
        setLoading(false)
      }
    }
    
    fetchUser()
  }, [id])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Employee not found.</p>
        </div>
      </div>
    )
  }
  
  const bookmarked = isBookmarked(user.id)
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'feedback', label: 'Feedback' }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge>{user.department}</Badge>
                  <Badge variant={getPerformanceColor(user.rating)}>
                    {user.rating >= 4.5 ? 'Top Performer' : user.rating >= 3.5 ? 'Good Performer' : 'Average'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => toggleBookmark(user.id)}
                variant={bookmarked ? 'secondary' : 'ghost'}
                size="sm"
              >
                {bookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button variant="primary" size="sm">
                Promote
              </Button>
            </div>
          </div>
        </Card>
        
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="font-medium">{user.firstName} {user.maidenName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Age</p>
                  <p className="font-medium">{user.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                  <p className="font-medium">{user.address.city}, {user.address.state}</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <h2 className="text-lg font-semibold mb-4">Performance Rating</h2>
              <div className="flex items-center gap-4 mb-4">
                <RatingBar rating={user.rating} size="lg" />
                <Badge variant={getPerformanceColor(user.rating)} className="text-lg px-4 py-2">
                  {user.rating.toFixed(1)} / 5.0
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
            </Card>
            
            <Card>
              <h2 className="text-lg font-semibold mb-4">Performance History</h2>
              <div className="space-y-2">
                {user.performanceHistory.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(item.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
        
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.projects.map((project, index) => (
              <Card key={index}>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{project.name}</h3>
                <div className="flex justify-between items-center mb-2">
                  <Badge variant={project.status === 'Completed' ? 'success' : 'warning'}>
                    {project.status}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {project.contribution}% contribution
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${project.contribution}%` }}
                  ></div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {user.feedback.map((item, index) => (
              <Card key={index}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.author}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.date}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{item.comment}</p>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}