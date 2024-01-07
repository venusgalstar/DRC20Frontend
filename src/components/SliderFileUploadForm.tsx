import { Tag } from 'antd'
import { useRef, useState } from 'react'

import { UploadIcon } from '@/assets/icons/upload'

import InputField from './InputField'

type SliderFileUploadFormProps = {
  recipientAddress: string
  onChangeRecipientAddress: (recipientAddress: string) => void
  onChangeFile: (files: any) => void
  file: any | null
}

const SliderFileUploadForm = ({
  recipientAddress,
  onChangeRecipientAddress,
  onChangeFile,
  file,
}: SliderFileUploadFormProps) => {
  const [error, _setError] = useState<string | null>(null)
  const fileInputRef = useRef(null)

  const handleDrop = (event: any) => {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFiles = async (files: any[]) => {
    const file = files[0]
    return onChangeFile(file)
  }

  const handleDragOver = (event: any) => {
    event.preventDefault()
  }

  const handleFileInputChange = (event: any) => {
    const selectedFiles = event.target.files
    handleFiles(selectedFiles)
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        // @ts-ignore
        onClick={() => fileInputRef?.current?.click()}
        style={{
          width: '100%',
          height: '100%',
          padding: '16px',
          border: '3px dashed #F5F5F5',
          borderRadius: '15px',

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          flexDirection: 'column',
        }}
      >
        <UploadIcon style={{ marginBlock: '32px' }} />
        <p>Drag and drop your ZIP-file here, or click to select it.</p>
        <p style={{ color: 'grey' }}>Supported file formats (compressed in a ZIP-file) in beta: .jpg, .webp, .png</p>
        <p style={{ color: 'grey' }}>Max. 25KB per file in beta.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>
      <div style={{ height: '50px', display: 'flex' }}>
        {error ? <span style={{ color: 'red' }}>{error}</span> : null}
        {file && !error && (
          <Tag
            style={{
              width: 'fit-content',
              height: 'fit-content',
              backgroundColor: '#EFF2F5',
              borderRadius: '5px',
              border: 'none',
              margin: '6px',
              padding: '6px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {file.name}
          </Tag>
        )}
      </div>
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
    </div>
  )
}

export default SliderFileUploadForm
