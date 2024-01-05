import InfoPopover from './InfoPopover'

const SliderHeader = (title: string, description: string, explanation?: string) => (
  <div>
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <h2 style={{ fontWeight: 'bold', marginBlockEnd: '0px' }}>{title}</h2>
      {explanation && <InfoPopover content={<div style={{ maxWidth: '300px' }}>{explanation}</div>} />}
    </span>
    <p style={{ marginBlockEnd: '0px' }}>{description}</p>
  </div>
)

export default SliderHeader
