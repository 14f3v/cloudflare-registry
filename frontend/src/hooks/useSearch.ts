import { useState, useMemo } from 'react'
import { RepositoryService } from '../services/repository.service'
import type { Repository } from '../types'

interface UseSearchReturn {
    query: string
    setQuery: (query: string) => void
    filteredItems: Repository[]
}

/**
 * Custom hook for searching/filtering repositories
 * Memoizes filtered results for performance
 */
export function useSearch(items: Repository[]): UseSearchReturn {
    const [query, setQuery] = useState('')

    const filteredItems = useMemo(() => {
        return RepositoryService.filterRepositories(items, query)
    }, [items, query])

    return {
        query,
        setQuery,
        filteredItems,
    }
}
