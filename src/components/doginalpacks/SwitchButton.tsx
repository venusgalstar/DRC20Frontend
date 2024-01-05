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
  highlightColor = '#FFB627',
}) => {
  const handleClick = () => {
    setIsActive(!isActive)
  }

  return (
    <div className="relative w-40 h-10 mb-5">
      <button
        onClick={handleClick}
        style={{ backgroundColor: isActive ? '#EFF2F5' : highlightColor }}
        className={`absolute top-0 left-0 w-44 h-10 rounded-full transition-all ${
          isActive ? 'text-black z-10' : 'text-white z-20'
        }`}
      >
        {leftText}
      </button>
      <button
        onClick={handleClick}
        style={{ left: '130px', backgroundColor: isActive ? highlightColor : '#EFF2F5' }}
        className={`absolute top-0 w-44 h-10 rounded-full transition-all ${
          isActive ? 'text-white z-20' : 'text-black z-10'
        }`}
      >
        {rightText}
      </button>
    </div>
  )
}

export default SwitchButton
