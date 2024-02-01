import { Feature } from '@/api'

import HeroButton from './HeroButton'
import HeroThumbnail from './HeroThumbnail'

const HeroContent = ({ feature }: { feature: Feature }) => {
  let { header, description, CTAText, CTALink, imageLink } = feature
  const paragraphs = Object.values(description)
  CTALink = CTALink.replace('drc-20.org', 'drcfront.web.app');
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-5 justify-between p-2">
      <HeroThumbnail imageURI={imageLink} name={header} />
      <div className="flex flex-col w-full gap-1 items-start pt-1 p-2 md:gap-4 md:mt-1 justify-around" style={{color:'#000'}}>
        <div>
          <h1 className="font-medium text-xl md:text-2xl text-left" style={{color:'#000'}}>{header}</h1>
        </div>
        <div className="flex flex-col gap-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="hidden md:flex text-left text-sm" style={{color:'#000'}}>
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
