import { useEffect } from 'react'

import { Feature } from '@/api'

import HeroContent from './HeroContent'

const HeroCarousel = ({
  features,
  currentSlide,
  nextSlide,
  autoSlide = false,
  autoSlideInterval = 3000,
}: {
  features: Feature[]
  currentSlide: number
  nextSlide: () => void
  autoSlide?: boolean
  autoSlideInterval?: number
}) => {
  useEffect(() => {
    if (!autoSlide) return
    const slideInterval = setInterval(nextSlide, autoSlideInterval)
    return () => clearInterval(slideInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="overflow-hidden w-full relative">
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {features.map((feature, index) => (
          <div key={index} className="flex-shrink-0 w-full">
            <HeroContent feature={feature} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
