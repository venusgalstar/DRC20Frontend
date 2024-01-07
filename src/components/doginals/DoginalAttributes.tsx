import { useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'

import { Doginal } from '@/types/dogeNft'

type DoginalDetailsProps = {
  doginal: Doginal
}

const DoginalAttributes = ({ doginal }: DoginalDetailsProps) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border-2 border-account-page-background bg-white rounded-lg mb-2">
      <button
        className="w-full text-left px-3 py-2 rounded flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-2">
          <img src="/details-accordion-logo.svg" alt="details" className="w-4"></img>
          <span className="font-semibold">Attributes</span>
        </div>
        <span className="focus:outline-none">{isOpen ? <FaAngleDown /> : <FaAngleUp />}</span>
      </button>
      {isOpen && (
        <div className="flex flex-wrap gap-2 border-t-2 border-account-page-background py-2 lg:py-[10px] px-3 xxs:text-xxxs xs:text-xs md:text-sm">
          {Object.entries(doginal.metadata).map(([key, value]) => (
            <div
              key={key}
              className="bg-account-page-default pb-1.5 pl-2 pr-8 rounded flex flex-col justify-start items-start"
            >
              <div className="text-xs uppercase font-normal mt-1">{key}</div>
              <div className="text-sm font-semibold">{value as string}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoginalAttributes
