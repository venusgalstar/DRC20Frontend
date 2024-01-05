import BaseButton from './BaseButton'

type ErrorSectionProps = {
  refetch?: () => void
}
const ErrorSection = ({ refetch }: ErrorSectionProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <p>There is an error loading data.</p>
      {refetch && <BaseButton onClick={refetch}>Try again</BaseButton>}
    </div>
  )
}

export default ErrorSection
