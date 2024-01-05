import CustomCheckbox from './CustomCheckbox'

type InscribeActionChooserProps = {
  actions: string[]
  actionType: string
  onChangeActionType: (actionType: string) => void
}

const InscribeActionChooser = ({ actions, actionType, onChangeActionType }: InscribeActionChooserProps) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <CustomCheckbox
      checked={actionType === actions[0]}
      label={actions[0]}
      onChange={(e) => onChangeActionType(actions[0])}
    />
    <CustomCheckbox
      checked={actionType === actions[1]}
      label={actions[1]}
      onChange={(e) => onChangeActionType(actions[1])}
    />
    <CustomCheckbox
      checked={actionType === actions[2]}
      label={actions[2]}
      onChange={(e) => onChangeActionType(actions[2])}
    />
  </div>
)

export default InscribeActionChooser
