import { useCallback } from 'react'

import { DisplayType } from './Trending'

const TypeFilter = ({
  displayedType,
  setDisplayedType,
}: {
  displayedType: DisplayType
  setDisplayedType: (displayType: DisplayType) => void
}) => {
  const onClickDoginals = useCallback(() => {
    setDisplayedType(DisplayType.DOGINALS)
  }, [setDisplayedType])

  const onClickDrc20 = useCallback(() => {
    setDisplayedType(DisplayType.DRC20)
  }, [setDisplayedType])

  return (
    <div className="flex">
      <button
        className={`py-2 px-6 md:w-32 md:text-sm ${
          displayedType === DisplayType.DOGINALS ? 'border-b-2 border-amber-500' : 'border-b-2 border-[#EFF2F5]'
        }`}
        onClick={onClickDoginals}
      >
        Doge NFT
      </button>
      <button
        className={`py-2 px-4 md:w-32 md:text-sm ${
          displayedType === DisplayType.DRC20 ? 'border-b-2 border-amber-500' : 'border-b-2 border-[#EFF2F5]'
        }`}
        onClick={onClickDrc20}
      >
        drc-20
      </button>
    </div>
  )
}

export default TypeFilter
