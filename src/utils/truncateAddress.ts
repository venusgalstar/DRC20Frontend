export const truncateAddress = (address: string) => {
  if (address) {
    const addressStart = address.substring(0, 6)
    const addressLength = address.length
    const cut = addressLength - 5
    const addressEnd = address.substring(addressLength, cut)
    return `${addressStart}...${addressEnd}`
  }
  return
}
