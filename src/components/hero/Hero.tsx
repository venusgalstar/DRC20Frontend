import { useEffect, useState } from 'react'
import { useInterval } from 'usehooks-ts'

import { Feature } from '@/api'

import { DoginalsCollection } from '../../types/dogeNft'
import ActiveSlide from './ActiveSlide'
import HeroCarousel from './HeroCarousel'
import LeftArrow from './LeftArrow'
import RightArrow from './RightArrow'

const MIN_SLIDE_NUMBER = 0

const Hero = ({ features }: { features: Feature[] }) => {
  const [slide, setSlide] = useState(0)
  const [slicedListOfFeatures, setSlicedListOfFeatures] = useState<Feature[]>(features)

  useEffect(() => {
    if (features) {
      const slicedList = features.slice(0, 10)
      setSlicedListOfFeatures(slicedList)
      return
    }
  }, [features])

  const handleNextSlide = () => {
    if (slide === slicedListOfFeatures.length - 1) {
      setSlide(MIN_SLIDE_NUMBER)
      return
    }

    setSlide(slide + 1)
  }

  const handlePreviousSlide = () => {
    if (slide === MIN_SLIDE_NUMBER) {
      setSlide(slicedListOfFeatures.length - 1)
      return
    }

    setSlide(slide - 1)
  }

  const [startX, setStartX] = useState<number | null>(null)

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setStartX(event.touches[0].clientX)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!startX) return

    const endX = event.changedTouches[0].clientX
    const diff = endX - startX

    if (diff > 0) {
      if (slide === MIN_SLIDE_NUMBER) {
        setSlide(slicedListOfFeatures.length - 1)
        return
      }

      setSlide(slide - 1)
    } else if (diff < 0) {
      if (slide === slicedListOfFeatures.length - 1) {
        setSlide(MIN_SLIDE_NUMBER)
        return
      }

      setSlide(slide + 1)
    }

    setStartX(null)
  }

  useInterval(async () => {
    handleNextSlide()
  }, 15000)

  if (!slicedListOfFeatures) {
    return <div className="flex items-center justify-center w-full">No features to display</div>
  }

  return (
    <div className="flex flex-col gap-3 items-center justify-center w-full">
      <div className="flex flex-row items-center justify-center md:gap-5 w-full">
        <LeftArrow handlePreviousSlide={handlePreviousSlide} />
        <div
          className="flex border-2 rounded-xl border-[#EFF2F5] w-full md:justify-center md:w-3/5 bg-white"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Assuming HeroCarousel is compatible with the new features structure */}
          <HeroCarousel features={slicedListOfFeatures} currentSlide={slide} nextSlide={handleNextSlide} />
        </div>
        <RightArrow handleNextSlide={handleNextSlide} />
      </div>
      <div>
        <ActiveSlide slide={slide} numberOfSlides={slicedListOfFeatures!.length} />
      </div>
    </div>
  )
}

export default Hero
