import { HeroBanner } from "@/components/menu/hero-banner"

export default function MenuLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <HeroBanner />
            <div className="max-w-[1400px] mx-auto">
                {children}
            </div>
        </>
    )
}
