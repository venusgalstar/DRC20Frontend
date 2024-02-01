import { useState } from 'react'

import { ActiveButtonIndex } from '@/types/common'

type TypeFilterProps = {
  firstButtonContent: string
  secondButtonContent: string
  setActiveButtonIndex: (activeButtonIndex: ActiveButtonIndex) => void
  secondButtonDisabled?: boolean
}

const TypeFilter = ({
  firstButtonContent,
  secondButtonContent,
  setActiveButtonIndex,
  secondButtonDisabled,
}: TypeFilterProps) => {
  const [activeButton, setActiveButton] = useState(ActiveButtonIndex.FIRST)

  const handleClick = (activeIndex: ActiveButtonIndex) => {
    setActiveButton(activeIndex)
    setActiveButtonIndex(activeIndex)
  }

  return (
    <div className="flex">
      <button
        className={`py-2 xxs:px-2 md:px-6 xxs:text-xxs xs:text-sm ${
          activeButton === ActiveButtonIndex.FIRST ? 'border-b-2 border-selected-color' : 'border-b-2 border-[#EFF2F5]'
        }`}
        onClick={() => handleClick(ActiveButtonIndex.FIRST)}
      >
        {firstButtonContent}
      </button>
      <button
        className={`py-2 xxs:px-2 md:px-6 xxs:text-xxs xs:text-sm ${
          activeButton === ActiveButtonIndex.SECOND ? 'border-b-2 border-selected-color' : 'border-b-2 border-[#EFF2F5]'
        } ${secondButtonDisabled ? 'text-black/50' : 'text-black'}`} style={{color:'#fff'}}
        onClick={() => handleClick(ActiveButtonIndex.SECOND)}
        disabled={secondButtonDisabled}
      >
        {secondButtonContent}
      </button>
    </div>
  )
}

export default TypeFilter
