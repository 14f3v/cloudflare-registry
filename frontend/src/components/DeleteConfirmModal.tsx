interface DeleteConfirmModalProps {
    isOpen: boolean
    repositories: string[]
    onConfirm: () => void
    onCancel: () => void
}

export function DeleteConfirmModal({ isOpen, repositories, onConfirm, onCancel }: DeleteConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
            ></div>

            {/* Modal */}
            <div className="relative bg-slate-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">⚠️</div>
                    <h2 className="text-xl font-bold text-white">Delete Repositories</h2>
                </div>

                {/* Warning */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                    <p className="text-red-300 text-sm font-medium mb-2">
                        This action cannot be undone!
                    </p>
                    <p className="text-white/70 text-sm">
                        You are about to permanently delete {repositories.length} {repositories.length === 1 ? 'repository' : 'repositories'}:
                    </p>
                </div>

                {/* Repository List */}
                <div className="bg-black/20 rounded-lg p-3 mb-6 max-h-48 overflow-y-auto">
                    <ul className="space-y-1">
                        {repositories.map(repo => (
                            <li key={repo} className="text-white/80 text-sm font-mono flex items-center gap-2">
                                <span className="text-red-400">•</span>
                                {repo}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
