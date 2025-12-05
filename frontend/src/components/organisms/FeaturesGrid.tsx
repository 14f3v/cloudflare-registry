import { FeatureCard } from '../molecules/FeatureCard'
import { cn } from '../../utils/cn'

interface FeaturesGridProps {
    className?: string
}

const features = [
    {
        icon: '🔐',
        title: 'OAuth Authentication',
        description: 'Secure login with Google & GitHub. No passwords to manage.',
    },
    {
        icon: '👥',
        title: 'Team Management',
        description: 'Create teams, assign roles, and manage permissions effortlessly.',
    },
    {
        icon: '🎫',
        title: 'Access Tokens',
        description: 'Generate scoped tokens for CI/CD pipelines and automation.',
    },
    {
        icon: '⚡',
        title: 'Edge Performance',
        description: 'Distributed globally across Cloudflare\'s network for ultra-low latency.',
    },
]

export function FeaturesGrid({ className }: FeaturesGridProps) {
    return (
        <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12', className)}>
            {features.map((feature, index) => (
                <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                />
            ))}
        </div>
    )
}
