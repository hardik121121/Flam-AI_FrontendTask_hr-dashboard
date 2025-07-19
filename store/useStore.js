import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      bookmarks: [],
      users: [],
      searchTerm: '',
      filters: {
        departments: [],
        ratings: []
      },
      
      setUsers: (users) => set({ users }),
      
      toggleBookmark: (userId) => set((state) => {
        const isBookmarked = state.bookmarks.includes(userId)
        return {
          bookmarks: isBookmarked
            ? state.bookmarks.filter(id => id !== userId)
            : [...state.bookmarks, userId]
        }
      }),
      
      removeBookmark: (userId) => set((state) => ({
        bookmarks: state.bookmarks.filter(id => id !== userId)
      })),
      
      setSearchTerm: (term) => set({ searchTerm: term }),
      
      setFilters: (filters) => set({ filters }),
      
      getFilteredUsers: () => {
        const { users, searchTerm, filters } = get()
        
        return users.filter(user => {
          const matchesSearch = !searchTerm || 
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.department?.toLowerCase().includes(searchTerm.toLowerCase())
          
          const matchesDepartment = filters.departments.length === 0 ||
            filters.departments.includes(user.department)
          
          const matchesRating = filters.ratings.length === 0 ||
            filters.ratings.includes(Math.floor(user.rating))
          
          return matchesSearch && matchesDepartment && matchesRating
        })
      },
      
      getBookmarkedUsers: () => {
        const { users, bookmarks } = get()
        return users.filter(user => bookmarks.includes(user.id))
      }
    }),
    {
      name: 'hr-dashboard-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ bookmarks: state.bookmarks })
    }
  )
)

export default useStore