import Checkbox from '@mui/material/Checkbox'
import React from 'react'

import InfoPopover from './InfoPopover'

type CheckboxProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  checked?: boolean
  explanationPopover?: string
}
const CustomCheckbox = ({ onChange, label, checked = false, explanationPopover }: CheckboxProps) => {
  return (
    <div style={{ marginInlineEnd: '9px' }}>
      <Checkbox
        checked={checked}
        onChange={onChange}
        sx={{
          color: '#FFAE42',
          '&.Mui-checked': {
            color: '#FFAE42',
            borderRadius: '15px',
          },
        }}
      />
      {label && <span style={{ fontWeight: 'bold' }}>{label}</span>}
      {explanationPopover && <InfoPopover content={explanationPopover} />}
    </div>
  )
}

export default CustomCheckbox
