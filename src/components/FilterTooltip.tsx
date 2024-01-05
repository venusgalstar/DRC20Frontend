import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space } from 'antd'
import React from 'react'

type FilterTooltipProps = {
  items: MenuProps['items']
  activeItem?: any
  style?: React.CSSProperties
  disabled?: boolean
  onClick: (item: any) => void
}
const FilterTooltip = ({ activeItem, items, style, disabled = false, onClick }: FilterTooltipProps) => {
  return (
    <div
      className={!disabled ? 'hover' : ''}
      style={{
        color: '#feb628',
        border: '2px solid #F6F6F6',
        borderRadius: '16px',
        padding: '0.5rem',
        margin: '0 0 0 1rem',
        ...style,
      }}
    >
      <Dropdown menu={{ items, onClick }}>
        <a
          onClick={(e) => {
            e.preventDefault()
            onClick(e)
          }}
        >
          <Space style={{ color: '#feb628' }}>
            {activeItem?.label}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </div>
  )
}

export default FilterTooltip
