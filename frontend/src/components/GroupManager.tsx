import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Group, GroupMember } from '../types'
import { UserAvatar } from './UserAvatar'

export function GroupManager() {
    const { user } = useAuth()
    const [groups, setGroups] = useState<Group[]>([])
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
    const [members, setMembers] = useState<GroupMember[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newGroupName, setNewGroupName] = useState('')
    const [newGroupDesc, setNewGroupDesc] = useState('')
    const [newMemberId, setNewMemberId] = useState('')

    useEffect(() => { loadGroups() }, [])
    useEffect(() => { if (selectedGroup) loadMembers(selectedGroup.id) }, [selectedGroup])

    const loadGroups = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/groups')
            if (!res.ok) throw new Error('Failed to load groups')
            setGroups(await res.json())
        } catch (err) {
            setError('Failed to load groups')
        } finally {
            setLoading(false)
        }
    }

    const loadMembers = async (groupId: string) => {
        try {
            const res = await fetch(`/api/groups/${groupId}`)
            if (!res.ok) throw new Error('Failed to load members')
            const data = await res.json()
            setMembers(data.members || [])
        } catch (err) {
            console.error(err)
        }
    }

    const createGroup = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newGroupName, description: newGroupDesc }),
            })
            if (!res.ok) throw new Error('Failed to create group')
            await loadGroups()
            setShowCreateModal(false)
            setNewGroupName('')
            setNewGroupDesc('')
        } catch (err) {
            setError('Failed to create group')
        }
    }

    const addMember = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedGroup || !newMemberId.trim()) return
        try {
            const isEmail = newMemberId.includes('@')
            const payload = isEmail
                ? { email: newMemberId.trim(), role: 'member' }
                : { userId: newMemberId.trim(), role: 'member' }
            const res = await fetch(`/api/groups/${selectedGroup.id}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to add member')
            }
            await loadMembers(selectedGroup.id)
            setNewMemberId('')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add member')
        }
    }

    const removeMember = async (memberId: string) => {
        if (!selectedGroup || !confirm('Remove this member?')) return
        try {
            const res = await fetch(`/api/groups/${selectedGroup.id}/members/${memberId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to remove member')
            await loadMembers(selectedGroup.id)
        } catch (err) {
            setError('Failed to remove member')
        }
    }

    const deleteGroup = async (groupId: string) => {
        if (!confirm('Delete this team? This cannot be undone.')) return
        try {
            const res = await fetch(`/api/groups/${groupId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete group')
            await loadGroups()
            setSelectedGroup(null)
        } catch (err) {
            setError('Failed to delete group')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Error Toast */}
            {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-red-200">{error}</span>
                    <button onClick={() => setError(null)} className="text-red-300 hover:text-red-100">✕</button>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white drop-shadow-sm">👥 Teams</h1>
                    <p className="text-white/60 mt-1">Manage team access to repositories</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                    + Create Team
                </button>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Teams List */}
                <div className="lg:col-span-1 space-y-3">
                    {groups.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                            <div className="text-5xl mb-3">👥</div>
                            <p className="text-white/60">No teams yet</p>
                        </div>
                    ) : (
                        groups.map(group => (
                            <button
                                key={group.id}
                                onClick={() => setSelectedGroup(group)}
                                className={`w-full text-left p-4 rounded-xl transition-all ${selectedGroup?.id === group.id
                                        ? 'bg-gradient-to-r from-primary/30 to-accent/30 border border-primary/50'
                                        : 'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <h3 className="font-semibold text-white">{group.name}</h3>
                                <p className="text-sm text-white/60">{group.members?.length || 0} members</p>
                            </button>
                        ))
                    )}
                </div>

                {/* Team Details */}
                <div className="lg:col-span-2">
                    {selectedGroup ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl opacity-30"></div>
                            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
                                {/* Team Header */}
                                <div className="flex items-start justify-between pb-6 border-b border-white/10">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedGroup.name}</h2>
                                        {selectedGroup.description && <p className="text-white/60">{selectedGroup.description}</p>}
                                    </div>
                                    <button
                                        onClick={() => deleteGroup(selectedGroup.id)}
                                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-lg transition-all"
                                    >
                                        Delete
                                    </button>
                                </div>

                                {/* Add Member Form */}
                                <form onSubmit={addMember} className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Email or User ID"
                                        value={newMemberId}
                                        onChange={e => setNewMemberId(e.target.value)}
                                        className="flex-1 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-all"
                                    >
                                        Add
                                    </button>
                                </form>

                                {/* Members List */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-white">Members ({members.length})</h3>
                                    {members.map(member => (
                                        <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar
                                                    src={member.avatar_url}
                                                    email={member.email}
                                                    name={member.full_name || member.name}
                                                    size="small"
                                                />
                                                <div>
                                                    <p className="font-medium text-white">{member.full_name || member.email}</p>
                                                    <p className="text-sm text-white/60">{member.email}</p>
                                                </div>
                                            </div>
                                            {member.user_id !== user?.id && (
                                                <button
                                                    onClick={() => removeMember(member.user_id)}
                                                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 text-sm rounded-lg transition-all"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                            <p className="text-white/60">Select a team to view members</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Team Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setShowCreateModal(false)}>
                    <div className="relative max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl"></div>
                        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all">✕</button>

                            <form onSubmit={createGroup} className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">Create New Team</h2>

                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Team Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Engineering, DevOps"
                                        value={newGroupName}
                                        onChange={e => setNewGroupName(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Description (optional)</label>
                                    <textarea
                                        placeholder="What is this team for?"
                                        value={newGroupDesc}
                                        onChange={e => setNewGroupDesc(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        rows={3}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
                                >
                                    Create Team
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
