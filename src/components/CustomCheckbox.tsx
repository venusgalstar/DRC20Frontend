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
      {label && <span style={{ fontWeight: 'bold', color:'black'}}>{label}</span>}
      <br></br>
      <Checkbox
        checked={checked}
        onChange={onChange}
        sx={{
          color: '#fff',
          '&.Mui-checked': {
            color: '#fff',
            borderRadius: '0px',
          },
        }}
      />
      {explanationPopover && <InfoPopover content={explanationPopover} />}
    </div>
  )
}

export default CustomCheckbox
