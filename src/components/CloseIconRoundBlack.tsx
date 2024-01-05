import React from 'react'

type CloseIconRoundBlackProps = {
  style?: React.CSSProperties
  onClick?: () => void
}

const CloseIconRoundBlack = ({ onClick, style }: CloseIconRoundBlackProps) => {
  return (
    <div style={{ width: '38px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        onClick={onClick}
        style={{
          border: '2px solid black',
          borderRadius: '100%',
          color: 'black',
          cursor: 'pointer',
          display: 'inline-block',
          fontSize: '14px',
          marginLeft: '16px',
          textAlign: 'center',
          width: '21px',
          ...style,
        }}
      >
        &times;
      </div>
    </div>
  )
}

export default CloseIconRoundBlack
