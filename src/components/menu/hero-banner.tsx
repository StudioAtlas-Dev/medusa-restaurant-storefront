import Image from 'next/image'

export function HeroBanner() {
    return (
        <div className="relative w-full h-[200px] mb-8">
            <div className="absolute inset-0 bg-black/10 z-10" /> 
            <Image
                src="/restaurant-banner.jpg" 
                alt="Restaurant banner"
                fill
                priority
                className="object-cover"
                sizes="100vw"
            />
        </div>
    )
}
