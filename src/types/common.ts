export enum ActiveButtonIndex {
  FIRST,
  SECOND,
}

export enum OfferStatus {
  SOLD = 'sold',
  LISTED = 'listed',
  UNLISTED = 'unlisted',
}

export type PaginationInfo = {
  currentDrc20Page: number
  totalDrc20Pages: number
  setCurrentDrc20Page: React.Dispatch<React.SetStateAction<number>>
  currentDogeNftPage: number
  totalDogeNftPages: number
  setCurrentDogeNftPage: React.Dispatch<React.SetStateAction<number>>
}

export enum ActivitySortTypes {
  Sale = 'Sale',
  List = 'List',
  Unlist = 'Unlist',
}

export enum SortByPriceTypes {
  PriceAscending = 'Price: Low to High',
  PriceDescending = 'Price: High to Low',
}

export const ActivitySortTypeToActivity: Record<ActivitySortTypes, 'sale' | 'list' | 'unlist'> = {
  [ActivitySortTypes.Sale]: 'sale',
  [ActivitySortTypes.List]: 'list',
  [ActivitySortTypes.Unlist]: 'unlist',
}

export type AddressConsumingProps = {
  address: string
}

export const ITEMS_PER_PAGE = 12
