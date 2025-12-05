import { useState, useEffect } from 'react'
import { RepositoryService } from '../services/repository.service'
import type { Repository } from '../types'

interface UseRepositoriesReturn {
    repositories: Repository[]
    loading: boolean
    error: string | null
    reload: () => void
}

/**
 * Custom hook for fetching and managing repositories
 * Separates business logic from UI components
 */
export function useRepositories(): UseRepositoriesReturn {
    const [repositories, setRepositories] = useState<Repository[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadRepositories = async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await RepositoryService.fetchAll()
            setRepositories(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load repositories')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadRepositories()
    }, [])

    return {
        repositories,
        loading,
        error,
        reload: loadRepositories,
    }
}
