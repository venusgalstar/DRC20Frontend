import React from 'react'

type SwitchButtonProps = {
  isActive: boolean
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>
  leftText?: string
  rightText?: string
  highlightColor?: string
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
  isActive,
  setIsActive,
  leftText = 'Packs',
  rightText = 'Collection',
  highlightColor = '#000',
}) => {
  const handleClick = () => {
    setIsActive(!isActive)
  }

  return (
    <div className='flex w-full justify-between'>
      <div>
        <span className='text-4xl font-bold text-left my-12'>{leftText=='Launchpad' ? (isActive ? 'Upcoming Mints >' : 'Upcoming Launches >') : (isActive ? 'Upcoming Collections >' : 'Upcoming Packs >')}</span>
      </div>
      <div className="relative flex w-40 h-10 mb-5" style={{marginRight:'200px', borderRadius:'0px'}}>
        <button
          onClick={handleClick}
          style={{ backgroundColor: isActive ? '#EFF2F5' : highlightColor, borderRadius:'0px', border:'1px solid white' }}
          className={`absolute top-0 left-0 w-44 h-10  ${isActive ? 'text-black z-10' : 'text-white z-20'
            }`}
        >
          {leftText}
        </button>
        <button
          onClick={handleClick}
          style={{ left: '170px', backgroundColor: isActive ? highlightColor : '#EFF2F5', borderRadius:'0px', border:'1px solid white' }}
          className={`absolute top-0 w-44 h-10 ${isActive ? 'text-white z-20' : 'text-black z-10'
            }`}
        >
          {rightText}
        </button>
      </div>
    </div>
  )
}

export default SwitchButton
