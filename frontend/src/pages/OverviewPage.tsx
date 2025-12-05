import { Hero } from '../components/organisms/Hero'
import { FeaturesGrid } from '../components/organisms/FeaturesGrid'
import { QuickStart } from '../components/organisms/QuickStart'

export function OverviewPage() {
    return (
        <div className="flex flex-col gap-8">
            <Hero />
            <FeaturesGrid />
            <QuickStart />
        </div>
    )
}
