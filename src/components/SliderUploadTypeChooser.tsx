import CustomCheckbox from './CustomCheckbox'

type SliderUploadTypeChooserProps = {
  upload: string[]
  uploadType: string
  onChange: (textUploadType: string) => void
  explanationTexts?: string[]
}

const SliderUploadTypeChooser = ({ uploadType, upload, onChange, explanationTexts }: SliderUploadTypeChooserProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <CustomCheckbox
        checked={uploadType === upload[0]}
        label={upload[0]}
        onChange={(e) => onChange(upload[0])}
        explanationPopover={
          (explanationTexts && explanationTexts[0]) || 'When choosing single, we will inscribe exactly what is there.'
        }
      />
      <CustomCheckbox
        checked={uploadType === upload[1]}
        label={upload[1]}
        onChange={(e) => onChange(upload[1])}
        explanationPopover={
          (explanationTexts && explanationTexts[1]) || 'With bulk, we will inscribe one for every new line.'
        }
      />
    </div>
  )
}

export default SliderUploadTypeChooser
