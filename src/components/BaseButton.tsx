import { Button } from 'antd'
import React from 'react'

type BaseButtonProps = {
  onClick: () => void
  children: React.ReactNode | string
  style?: React.CSSProperties
  disabled?: boolean
  buttonType?: 'primary' | 'secondary'
}

const BaseButton = ({ onClick, children, style, disabled = false, buttonType = 'primary' }: BaseButtonProps) => {
  return (
    <Button
      disabled={disabled}
      style={{
        background: disabled ? '#ccc' : buttonType == 'primary' ? '#feb628' : '#fff',
        border: buttonType == 'primary' ? 'none' : '2px solid #f5f5f5',
        borderRadius: '0px',
        color: buttonType == 'primary' ? '#fff' : '#000',
        fontWeight: 'bold',
        height: '40px',
        padding: '0 32px',
        justifyContent: 'flex-start',
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export default BaseButton
