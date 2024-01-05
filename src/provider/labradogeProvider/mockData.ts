import { Labradoge } from '@/types/labradoge'

import labradoge from '../../assets/images/labradoge.jpg'

export const mockLabradoge: Labradoge = {
  name: 'Labradoge',
  collectionSymbol: 'labradoge',
  inscriptionId: 10,
  rarity: 0.2,
  id: 2,
  image: labradoge,
  attributes: [
    { value: 'beige', probability: 0.2, label: 'fur' },
    { value: 'cool', probability: 0.2, label: 'eyes' },
    { value: 'angry', probability: 0.2, label: 'mouth' },
    { value: 'grey', probability: 0.2, label: 'background' },
    { value: 'beanie', probability: 0.2, label: 'headwear' },
    { value: 'shirt', probability: 0.2, label: 'clothing' },
    { value: 'rocket', probability: 0.2, label: 'hand' },
    { value: '2', probability: 0.2, label: 'tennis balls' },
  ],
}
