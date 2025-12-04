import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Group, GroupMember } from '../types';
import { UserAvatar } from './UserAvatar';

export function GroupManager() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [newMemberId, setNewMemberId] = useState('');

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            loadMembers(selectedGroup.id);
        }
    }, [selectedGroup]);

    const loadGroups = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/groups');
            if (!res.ok) throw new Error('Failed to load groups');
            const data = await res.json();
            setGroups(data);
        } catch (err) {
            setError('Failed to load groups');
        } finally {
            setLoading(false);
        }
    };

    const loadMembers = async (groupId: string) => {
        try {
            const res = await fetch(`/api/groups/${groupId}`);
            if (!res.ok) throw new Error('Failed to load members');
            const data = await res.json();
            setMembers(data.members || []);
        } catch (err) {
            console.error(err);
        }
    };

    const createGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newGroupName, description: newGroupDesc }),
            });
            if (!res.ok) throw new Error('Failed to create group');

            await loadGroups();
            setShowCreateModal(false);
            setNewGroupName('');
            setNewGroupDesc('');
        } catch (err) {
            setError('Failed to create group');
        }
    };

    const addMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGroup) return;

        try {
            const res = await fetch(`/api/groups/${selectedGroup.id}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: newMemberId, role: 'member' }),
            });
            if (!res.ok) throw new Error('Failed to add member');

            await loadMembers(selectedGroup.id);
            setNewMemberId('');
        } catch (err) {
            setError('Failed to add member');
        }
    };

    const removeMember = async (userId: string) => {
        if (!selectedGroup) return;
        if (!confirm('Are you sure you want to remove this member?')) return;

        try {
            const res = await fetch(`/api/groups/${selectedGroup.id}/members/${userId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to remove member');

            await loadMembers(selectedGroup.id);
        } catch (err) {
            setError('Failed to remove member');
        }
    };

    const deleteGroup = async (groupId: string) => {
        if (!confirm('Are you sure you want to delete this group? This cannot be undone.')) return;

        try {
            const res = await fetch(`/api/groups/${groupId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete group');

            if (selectedGroup?.id === groupId) setSelectedGroup(null);
            await loadGroups();
        } catch (err) {
            setError('Failed to delete group');
        }
    };

    if (loading && !groups.length) return <div className="loading-state">Loading teams...</div>;

    return (
        <div className="group-manager">
            {error && (
                <div className="error-toast" onClick={() => setError(null)}>
                    {error}
                    <span className="close-toast">×</span>
                </div>
            )}

            <div className="group-header">
                <div>
                    <h1>Teams</h1>
                    <p className="subtitle">Manage team members and permissions</p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                    Create New Team
                </button>
            </div>

            {groups.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <h3>No teams yet</h3>
                    <p>Create a team to collaborate with others</p>
                    <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                        Create Your First Team
                    </button>
                </div>
            ) : (
                <div className="group-layout">
                    <div className="group-sidebar">
                        <div className="group-list">
                            {groups.map(group => (
                                <div
                                    key={group.id}
                                    className={`group-item ${selectedGroup?.id === group.id ? 'active' : ''}`}
                                    onClick={() => setSelectedGroup(group)}
                                >
                                    <span className="group-icon">👥</span>
                                    <div className="group-info">
                                        <span className="group-name">{group.name}</span>
                                        <span className="group-role">
                                            {group.created_by === user?.id ? 'Owner' : 'Member'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="group-content">
                        {selectedGroup ? (
                            <>
                                <div className="content-header">
                                    <div>
                                        <h2>{selectedGroup.name}</h2>
                                        <p className="group-description">{selectedGroup.description || 'No description'}</p>
                                    </div>
                                    {selectedGroup.created_by === user?.id && (
                                        <button
                                            className="btn-danger-small"
                                            onClick={() => deleteGroup(selectedGroup.id)}
                                        >
                                            Delete Team
                                        </button>
                                    )}
                                </div>

                                <div className="members-section">
                                    <h3>Members ({members.length})</h3>

                                    <div className="members-list">
                                        {members.map(member => (
                                            <div key={member.id} className="member-item">
                                                <div className="member-info">
                                                    <UserAvatar
                                                        src={member.avatar_url}
                                                        email={member.email}
                                                        name={member.full_name}
                                                        size="medium"
                                                    />
                                                    <div className="member-details">
                                                        <div className="member-name">{member.full_name || member.email}</div>
                                                        <div className="member-email">{member.email}</div>
                                                    </div>
                                                </div>
                                                <div className="member-actions">
                                                    <span className="member-role-badge">{member.role}</span>
                                                    {selectedGroup.created_by === user?.id && member.user_id !== user?.id && (
                                                        <button
                                                            className="btn-remove"
                                                            onClick={() => removeMember(member.user_id)}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedGroup.created_by === user?.id && (
                                        <div className="add-member-section">
                                            <h4>Add Team Member</h4>
                                            <form onSubmit={addMember} className="add-member-form">
                                                <div className="form-group">
                                                    <label htmlFor="member-email">User Email or ID</label>
                                                    <input
                                                        id="member-email"
                                                        type="text"
                                                        placeholder="user@example.com or user ID"
                                                        value={newMemberId}
                                                        onChange={e => setNewMemberId(e.target.value)}
                                                        className="form-input"
                                                        required
                                                    />
                                                    <p className="form-hint">Enter the email address or user ID to add to this team</p>
                                                </div>
                                                <button type="submit" className="btn-primary">
                                                    Add Member
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="empty-selection">
                                <span className="empty-icon">👈</span>
                                <p>Select a team to view members</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
                        <h2>Create New Team</h2>
                        <form onSubmit={createGroup}>
                            <div className="form-group">
                                <label>Team Name</label>
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={e => setNewGroupName(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newGroupDesc}
                                    onChange={e => setNewGroupDesc(e.target.value)}
                                    className="form-input"
                                    rows={3}
                                />
                            </div>
                            <button type="submit" className="btn-primary">Create Team</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
