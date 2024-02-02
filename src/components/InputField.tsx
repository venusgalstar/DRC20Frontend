import { Input, InputNumber, Popover } from 'antd'

import { CopyIcon } from '@/assets/icons/copy'

const InputField = ({
  label,
  description,
  placeholder,
  onChange,
  disabled,
  value,
  numberOnly,
  onClickCopy,
  style,
  inputStyle,
  wrapperStyle,
  ...otherInputProps
}: {
  label?: string
  description?: any
  placeholder?: string
  onChange?: (e: any) => void
  disabled?: boolean
  value?: any
  numberOnly?: boolean
  style?: any
  inputStyle?: any
  wrapperStyle?: any
  onClickCopy?: () => void
  [key: string]: any
}) => {
  const InputInstance = numberOnly ? InputNumber : Input

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '2px solid #f5f5f5',
        borderRadius: '0px',
        margin: 'auto',
        marginBottom: '24px',
        marginTop: '24px',
        maxWidth: '480px',
        width: '100%',
        position: 'relative',
        ...wrapperStyle,
      }}
    >
      {label ? (
        <span
          style={{
            color: '#feb628',
            display: 'block',
            fontSize: '12px',
            paddingBottom: '8px',
            textAlign: 'left',
            padding: '8px 16px',
          }}
        >
          {label}
          {description && (
            <Popover content={description} trigger="hover" placement="right">
              <span
                style={{
                  border: '1px solid #feb628',
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
                }}
              >
                i
              </span>
            </Popover>
          )}
        </span>
      ) : (
        ''
      )}
      <InputInstance
        autoFocus
        bordered={false}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        disabled={disabled || false}
        {...otherInputProps}
        size="large"
        style={{
          padding: '0px',
          width: '90%',
          maxWidth: '480px',
          marginBottom: label ? '8px' : '0px',
          ...style,
          ...inputStyle,
        }}
      />
      {onClickCopy && <CopyIcon style={{ marginBlockEnd: '10px' }} onClick={onClickCopy} />}
    </div>
  )
}

export default InputField
