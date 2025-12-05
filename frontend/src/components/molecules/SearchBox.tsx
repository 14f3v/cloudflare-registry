import { cn } from '../../utils/cn'

interface SearchBoxProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function SearchBox({ value, onChange, placeholder = 'Search...', className }: SearchBoxProps) {
    return (
        <div className={cn('relative', className)}>
            {/* Glass Search Container */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all">
                {/* Search Icon */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                    <span className="text-xl drop-shadow-sm">🔍</span>
                </div>

                {/* Input */}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-14 pr-12 py-4 bg-transparent border-none text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-2xl"
                />

                {/* Clear Button */}
                {value && (
                    <button
                        onClick={() => onChange('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white/70 hover:text-white transition-all"
                        aria-label="Clear search"
                    >
                        <span className="text-sm">✕</span>
                    </button>
                )}
            </div>
        </div>
    )
}
