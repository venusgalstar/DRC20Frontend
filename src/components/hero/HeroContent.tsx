import { Feature } from '@/api'

import HeroButton from './HeroButton'
import HeroThumbnail from './HeroThumbnail'

const HeroContent = ({ feature }: { feature: Feature }) => {
  const { header, description, CTAText, CTALink, imageLink } = feature
  const paragraphs = Object.values(description)

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-5 justify-between p-2">
      <HeroThumbnail imageURI={imageLink} name={header} />
      <div className="flex flex-col w-full gap-1 items-start pt-1 p-2 md:gap-4 md:mt-1 justify-around">
        <div>
          <h1 className="font-medium text-xl md:text-2xl text-left">{header}</h1>
        </div>
        <div className="flex flex-col gap-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="hidden md:flex text-left text-sm">
              {paragraph}
            </p>
          ))}
        </div>
        <HeroButton text={CTAText} onClick={() => window.open(CTALink, '_blank')} />
      </div>
    </div>
  )
}

export default HeroContent
