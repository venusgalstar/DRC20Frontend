// Grey Background pricetag used inside the ListingCard component

type PriceTagProps = {
  children: React.ReactNode
  style?: React.CSSProperties
}
const PriceTag = ({ children, style }: PriceTagProps) => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#f5f5f5',
        height: '35px',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        marginBottom: '1rem',
        fontWeight: 'bold',
        fontSize: '12px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default PriceTag
