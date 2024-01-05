export const PercentValue = ({ value, color, ...props }: any) => {
  let colorToShow = color
  if (!color && value >= 0) {
    colorToShow = '#14C784'
  } else if (!color && value < 0) {
    colorToShow = '#EA3943'
  } else if (!color) {
    colorToShow = '#000000'
  }

  return (
    <span style={{ color: colorToShow }} {...props}>
      {typeof Number(value) === 'number' ? Number(value).toFixed(2) : '0.00'}%
    </span>
  )
}

export default PercentValue
