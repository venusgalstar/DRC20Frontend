export const truncateInscriptionId = (inscriptionId: string) => {
  return (
    inscriptionId.substring(0, 10) + '...' + inscriptionId.substring(inscriptionId.length - 7, inscriptionId.length)
  )
}
