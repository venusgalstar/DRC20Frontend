import { Popover } from 'antd'
import CSS from 'csstype'
import React from 'react'

type InfoPopoverProps = {
  content: string | React.ReactNode
  style?: CSS.Properties
}

const InfoPopover = ({ content, style }: InfoPopoverProps) => {
  return (
    <Popover content={content} trigger="hover" placement="right">
      <span
        style={{
          border: '2px solid #feb628',
          borderRadius: '100%',
          color: '#feb628',
          cursor: 'pointer',
          display: 'inline-block',
          fontSize: '10px',
          fontWeight: 'bold',
          marginLeft: '8px',
          textAlign: 'center',
          height: '18px',
          width: '18px',
          ...style,
        }}
      >
        i
      </span>
    </Popover>
  )
}

export default InfoPopover
