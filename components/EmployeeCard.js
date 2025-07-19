'use client'

import Link from 'next/link'
import Card from './Card'
import Button from './Button'
import Badge from './Badge'
import RatingBar from './RatingBar'
import useBookmarks from '@/hooks/useBookmarks'
import { getPerformanceColor } from '@/lib/utils'

export default function EmployeeCard({ user }) {
  const { toggleBookmark, isBookmarked } = useBookmarks()
  const bookmarked = isBookmarked(user.id)
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={() => toggleBookmark(user.id)}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <svg
              className="w-6 h-6"
              fill={bookmarked ? 'currentColor' : 'none'}
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
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Age:</span>
            <span className="text-sm font-medium">{user.age}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Department:</span>
            <Badge>{user.department}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Performance:</span>
            <div className="flex items-center gap-2">
              <RatingBar rating={user.rating} size="sm" />
              <Badge variant={getPerformanceColor(user.rating)}>
                {user.rating >= 4.5 ? 'Excellent' : user.rating >= 3.5 ? 'Good' : user.rating >= 2.5 ? 'Average' : 'Needs Improvement'}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Link href={`/employee/${user.id}`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              View
            </Button>
          </Link>
          <Button variant="secondary" size="sm" className="flex-1">
            Promote
          </Button>
        </div>
      </div>
    </Card>
  )
}