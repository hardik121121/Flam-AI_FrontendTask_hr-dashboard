'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import Card from '@/components/Card'
import useStore from '@/store/useStore'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import { departments, getRandomDepartment, getRandomRating } from '@/lib/utils'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement)

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const users = useStore(state => state.users)
  const setUsers = useStore(state => state.setUsers)
  const bookmarks = useStore(state => state.bookmarks)
  
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
  
  const departmentData = () => {
    const deptCounts = {}
    const deptRatings = {}
    
    departments.forEach(dept => {
      deptCounts[dept] = 0
      deptRatings[dept] = []
    })
    
    users.forEach(user => {
      if (user.department) {
        deptCounts[user.department]++
        deptRatings[user.department].push(user.rating)
      }
    })
    
    const avgRatings = {}
    Object.keys(deptRatings).forEach(dept => {
      if (deptRatings[dept].length > 0) {
        avgRatings[dept] = deptRatings[dept].reduce((a, b) => a + b, 0) / deptRatings[dept].length
      } else {
        avgRatings[dept] = 0
      }
    })
    
    return {
      counts: deptCounts,
      averageRatings: avgRatings
    }
  }
  
  const { counts, averageRatings } = departmentData()
  
  const doughnutData = {
    labels: departments.filter(dept => counts[dept] > 0),
    datasets: [{
      data: departments.filter(dept => counts[dept] > 0).map(dept => counts[dept]),
      backgroundColor: [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
        '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
      ],
      borderWidth: 0
    }]
  }
  
  const barData = {
    labels: departments,
    datasets: [{
      label: 'Average Performance Rating',
      data: departments.map(dept => averageRatings[dept]),
      backgroundColor: '#3B82F6',
      borderRadius: 4
    }]
  }
  
  const bookmarkTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
    datasets: [{
      label: 'Bookmarked Employees',
      data: [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 15),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 18),
        bookmarks.length
      ],
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.3
    }]
  }
  
  const performanceDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    users.forEach(user => {
      const rating = Math.floor(user.rating)
      distribution[rating]++
    })
    return distribution
  }
  
  const perfDist = performanceDistribution()
  
  const performanceData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [{
      label: 'Number of Employees',
      data: Object.values(perfDist),
      backgroundColor: ['#EF4444', '#F59E0B', '#EAB308', '#84CC16', '#10B981'],
      borderRadius: 4
    }]
  }
  
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
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Analytics Dashboard
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Employee Distribution by Department</h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut
                data={doughnutData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 15,
                        font: { size: 12 }
                      }
                    }
                  }
                }}
              />
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold mb-4">Average Performance by Department</h3>
            <div className="h-64">
              <Bar
                data={barData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 5,
                      ticks: { stepSize: 1 }
                    }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold mb-4">Bookmark Trends</h3>
            <div className="h-64">
              <Line
                data={bookmarkTrendData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold mb-4">Performance Distribution</h3>
            <div className="h-64">
              <Bar
                data={performanceData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 }
                    }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
          </Card>
        </div>
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
          </Card>
          
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Bookmarked</p>
            <p className="text-3xl font-bold text-blue-600">{bookmarks.length}</p>
          </Card>
          
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Performance</p>
            <p className="text-3xl font-bold text-green-600">
              {users.length > 0 ? (users.reduce((acc, user) => acc + user.rating, 0) / users.length).toFixed(1) : '0.0'}
            </p>
          </Card>
          
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Top Performers</p>
            <p className="text-3xl font-bold text-purple-600">
              {users.filter(user => user.rating >= 4.5).length}
            </p>
          </Card>
        </div>
      </main>
    </div>
  )
}