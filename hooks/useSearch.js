'use client'

import useStore from '@/store/useStore'

export default function useSearch() {
  const searchTerm = useStore(state => state.searchTerm)
  const setSearchTerm = useStore(state => state.setSearchTerm)
  const filters = useStore(state => state.filters)
  const setFilters = useStore(state => state.setFilters)
  const getFilteredUsers = useStore(state => state.getFilteredUsers)
  
  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    getFilteredUsers
  }
}