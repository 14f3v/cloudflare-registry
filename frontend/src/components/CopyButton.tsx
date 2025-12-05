import { useState } from 'react'

interface CopyButtonProps {
    text: string
    className?: string
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <button
            onClick={handleCopy}
            className={`
                px-3 py-1.5 rounded-lg transition-all font-medium text-sm
                ${copied
                    ? 'bg-green-500/30 text-green-300 border border-green-400/50 backdrop-blur-sm'
                    : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 hover:text-white hover:border-white/30 backdrop-blur-sm'
                }
                ${className}
            `}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
            {copied ? '✓ Copied' : '📋 Copy'}
        </button>
    )
}
