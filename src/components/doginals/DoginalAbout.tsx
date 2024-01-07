import { useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'

type DoginalDetailsProps = {
  doginalsDescription: string
}

const DoginalAbout = ({ doginalsDescription }: DoginalDetailsProps) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border-2 border-account-page-background bg-white rounded-lg mb-2">
      <button
        className="w-full text-left px-3 py-2 rounded flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-2">
          <img src="/details-accordion-logo.svg" alt="details" className="w-4"></img>
          <span className="font-semibold">About</span>
        </div>
        <span className="focus:outline-none">{isOpen ? <FaAngleDown /> : <FaAngleUp />}</span>
      </button>
      {isOpen && (
        <div className="border-t-2 text-left border-account-page-background py-2 lg:py-[10px] px-3 xxs:text-xxxs xs:text-xs md:text-sm">
          {doginalsDescription}
        </div>
      )}
    </div>
  )
}

export default DoginalAbout
