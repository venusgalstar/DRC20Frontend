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
    <div className="flex w-full justify-center">
      <button style={{borderRadius:'0',borderColor:'#fff'}}
        className={`py-2 px-6 md:w-32 md:text-sm ${
          displayedType === DisplayType.DOGINALS ? 'border-b-2 border-amber-500 border-[#FFFFFF] bg-black text-white' : 'border-b-2 bg-white text-black border-[#FFFFFF]'
        }`}
        onClick={onClickDoginals}
      >
        Doge NFT
      </button>
      <button style={{borderRadius:'0',borderColor:'#fff'}}
        className={`py-2 px-4 md:w-32 md:text-sm ${
          displayedType === DisplayType.DRC20 ? 'border-b-2 border-amber-500 border-[#FFFFFF] bg-black text-white' : 'border-b-2 bg-white text-black border-[#FFFFFF]'
        }`}
        onClick={onClickDrc20}
      >
        drc-20
      </button>
    </div>
  )
}

export default TypeFilter
