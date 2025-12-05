import { StepCard } from '../molecules/StepCard'
import { CommandBlock } from '../molecules/CommandBlock'
import { cn } from '../../utils/cn'

interface QuickStartProps {
    className?: string
}

export function QuickStart({ className }: QuickStartProps) {
    const registryHost = typeof window !== 'undefined' ? window.location.host : 'registry.example.com'

    return (
        <div className={cn('relative', className)}>
            {/* Gradient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-purple-500/20 blur-3xl opacity-40"></div>

            {/* Glass Container */}
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="text-5xl mb-4 drop-shadow-lg">🚀</div>
                    <h2 className="text-4xl font-bold mb-3 text-white drop-shadow-md">
                        Get Started in Minutes
                    </h2>
                    <p className="text-lg text-white/70">
                        Three simple steps to push your first container image
                    </p>
                </div>

                {/* Step Cards */}
                <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                    <StepCard
                        number={1}
                        title="Login to Registry"
                        hint="Use your Personal Access Token as password"
                    >
                        <CommandBlock command={`docker login ${registryHost}`} />
                    </StepCard>

                    <StepCard
                        number={2}
                        title="Tag Your Image"
                        hint="Prefix with registry hostname"
                    >
                        <CommandBlock command={`docker tag myapp:latest ${registryHost}/myapp:latest`} />
                    </StepCard>

                    <StepCard
                        number={3}
                        title="Push to Registry"
                        hint="Deploy from anywhere, instantly"
                    >
                        <CommandBlock command={`docker push ${registryHost}/myapp:latest`} />
                    </StepCard>
                </div>
            </div>
        </div>
    )
}
