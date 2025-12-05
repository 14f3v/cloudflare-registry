import type { Repository } from '../types'

/**
 * Service layer for repository-related API calls
 * Pure functions with no React dependencies
 */
export class RepositoryService {
    /**
     * Fetch all repositories accessible to the current user
     */
    static async fetchAll(): Promise<Repository[]> {
        const response = await fetch('/api/repositories')
        if (!response.ok) {
            throw new Error('Failed to fetch repositories')
        }
        return response.json()
    }

    /**
     * Search repositories by name or tag
     */
    static filterRepositories(repositories: Repository[], query: string): Repository[] {
        if (!query.trim()) {
            return repositories
        }

        const lowerQuery = query.toLowerCase()
        return repositories.filter(repo =>
            repo.name.toLowerCase().includes(lowerQuery) ||
            repo.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
    }
}
