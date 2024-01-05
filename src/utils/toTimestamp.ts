export const toTimestamp = (strDate: string) => {
  const dt = new Date(strDate).getTime()
  return dt / 1000
}
