'use client'

import useStore from '@/store/useStore'

export default function useBookmarks() {
  const bookmarks = useStore(state => state.bookmarks)
  const toggleBookmark = useStore(state => state.toggleBookmark)
  const removeBookmark = useStore(state => state.removeBookmark)
  const getBookmarkedUsers = useStore(state => state.getBookmarkedUsers)
  
  const isBookmarked = (userId) => bookmarks.includes(userId)
  
  return {
    bookmarks,
    toggleBookmark,
    removeBookmark,
    isBookmarked,
    getBookmarkedUsers
  }
}