import React from 'react'

interface AmountInputProps {
  value: number
  onChange: (value: number) => void
  max?: number
  className?: string
  buttonDisabled?: boolean | undefined
}

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  max = 10,
  className = '',
  buttonDisabled = false,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '2px solid #f5f5f5',
        borderRadius: '0px',
        margin: 'auto',
        paddingTop: '3px',
        paddingBottom: '3px',
        maxWidth: '80px',
        width: '100%',
      }}
      className={className}
    >
      <button
        style={{ backgroundColor: 'white', color: 'black', border: 'none', width: 25 }}
        onClick={() => onChange(value > 1 ? value - 1 : 1)}
        disabled={value === 1 || buttonDisabled}
      >
        -
      </button>

      <input
        type="number"
        value={value}
        min="1"
        max="5"
        onChange={(e) => {
          const newValue = Number(e.target.value)
          if (newValue >= 1 && newValue <= max) {
            onChange(newValue)
          }
        }}
        style={{ textAlign: 'center', border: 'none', backgroundColor: 'white', color: 'black', width: 25 }}
      />

      <button
        style={{ backgroundColor: 'white', color: 'black', border: 'none', width: 25 }}
        onClick={() => onChange(value < max ? value + 1 : max)}
        disabled={value === max || buttonDisabled}
      >
        +
      </button>
    </div>
  )
}

export default AmountInput
