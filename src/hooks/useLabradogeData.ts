import { LabradogeContext } from '@/provider/labradogeProvider/labradogeProvider'

export function useLabradogeData() {
  const labradogeData = useContext(LabradogeContext)

  if (!labradogeData) {
    console.error('Error: useLabradogeData must be used within a LabradogeProvider')
  }

  return labradogeData
}
