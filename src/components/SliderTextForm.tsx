import { useState } from 'react';

import InputField from './InputField'

type SliderTextFormProps = {
  text: string
  onChangeText: (text: string) => void
  recipientAddress: string
  onChangeRecipientAddress: (recipientAddress: string) => void
  placeholder: string
  onChangeFromTo?: (from: number, to: number) => void
}

const SliderTextForm = ({
  text,
  onChangeText,
  recipientAddress,
  onChangeRecipientAddress,
  placeholder,
  onChangeFromTo,
}: SliderTextFormProps) => {
  const [numberFrom, setNumberFrom] = useState<number>(0)
  const [numberTo, setNumberTo] = useState<number>(0)

  const handleNumberFromChange = (value: number) => {
    setNumberFrom(value)
    if (onChangeFromTo) {
      onChangeFromTo(value, numberTo)
    }
  }

  const handleNumberToChange = (value: number) => {
    setNumberTo(value)
    if (onChangeFromTo) {
      onChangeFromTo(numberFrom, value) // Call the onChangeFromTo prop if provided
    }
  }

  return (
    <>
      <textarea
        rows={7}
        placeholder={placeholder}
        hidden={Boolean(onChangeFromTo)}
        style={{
          resize: 'none',
          border: '2px solid #f5f5f5',
          borderRadius: '0px',
          outline: 'none',
          maxWidth: '480px',
          width: '100%',
          margin: '24px 0 auto',
          padding: '8px 16px',
          color: '#000',
        }}
        value={text}
        onChange={(e) => {
          onChangeText(e.target.value)
        }}
      />
      {onChangeFromTo && (
        <>
          <div className="flex justiy-equal">
            <InputField
              label="Inscribe from block"
              description={
                <div style={{ maxWidth: '200px' }}>
                  The .dogemap Id from which the inscription process should start.
                </div>
              }
              placeholder="Inscribe from"
              value={numberFrom}
              onChange={(value: number) => {
                if (!value) return
                handleNumberFromChange(value)
              }}
              numberOnly={true}
              inputStyle={{ marginLeft: '-10px' }}
              wrapperStyle={{ marginLeft: '0', marginBottom: '0', marginTop: '0', maxWidth: '200px' }}
            />
            <InputField
              label="Inscribe to block"
              description={
                <div style={{ maxWidth: '200px' }}>The .dogemap Id until which the inscription process should go.</div>
              }
              placeholder="Inscribe to"
              value={numberTo}
              onChange={(value: number) => {
                handleNumberToChange(value)
              }}
              numberOnly={true}
              inputStyle={{ marginLeft: '-10px' }}
              wrapperStyle={{ marginRight: '0', marginBottom: '0', marginTop: '0', maxWidth: '200px' }}
            />
          </div>
        </>
      )}
      <InputField
        label="Wallet address"
        description={
          <div style={{ maxWidth: '300px' }}>
            We recommend to use the Doge Labs Wallet. Install it{' '}
            <a href={'https://chrome.google.com/webstore/detail/doge-labs-wallet/jiepnaheligkibgcjgjepjfppgbcghmp'}>
              here:
            </a>
            <br /> In case you do not have a wallet address yet, you can create it with it.
          </div>
        }
        placeholder="Recipient wallet address"
        value={recipientAddress}
        onChange={(e: any) => {
          onChangeRecipientAddress(e.target.value)
        }}
        inputStyle={{ marginLeft: '-10px' }}
      />
    </>
  )
}

export default SliderTextForm
