import { Popover, Select } from 'antd'

const SelectField = ({
  label,
  description,
  placeholder,
  options,
  defaultValue,
  onChange,
  disabled,
  error,
  ...otherSelectProps
}: {
  label: string
  description?: any
  placeholder?: string
  options: any[]
  defaultValue?: string
  onChange?: (e: any) => void
  disabled?: boolean
  error?: string
  otherSelectProps?: any[]
}) => {
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
      }}
    >
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
      <Select
        bordered={false}
        aria-errormessage="error"
        showSearch
        onChange={onChange}
        optionFilterProp="children"
        options={options}
        placeholder={placeholder}
        disabled={disabled || false}
        defaultValue={defaultValue}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        {...otherSelectProps}
        size="large"
        style={{
          padding: '8px 16px',
          width: '100%',
          maxWidth: '480px',
          marginBottom: '8px',
        }}
      />
    </div>
  )
}

export default SelectField
