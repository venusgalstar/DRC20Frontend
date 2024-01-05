import { CollectionContext } from '@/provider/collectionProvider/collectionProvider'
import { useContext } from 'react'

export function useCollectionData() {
  const collectionData = useContext(CollectionContext)

  if (!collectionData) {
    console.error('Error: useCollectionData must be used within a CollectionProvider')
  }

  return collectionData
}
