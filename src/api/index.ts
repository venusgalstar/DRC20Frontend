import axios from 'axios'

import Sentry from '@/main'
import { MINER_FEE } from '@/utils/constants'

import {
  Doginal,
  DoginalBalanceQuery,
  DoginalOffer,
  DoginalsCollection,
  DoginalsCollectionData,
  DoginalsCollectionDto,
} from '../types/dogeNft'
import { Drc20Data, Drc20Offer } from '../types/drc20'
import { executeAsync } from './wrappers'

const DRC20_API = import.meta.env.VITE_DRC20_API || 'https://thedragontest.com/api/'
const WALLET_API = import.meta.env.VITE_WALLET_API || 'https://wallet-api.dogeord.io/'
const UTXO_SERVICE_API = import.meta.env.VITE_UTXO_SERVICE_API || 'https://unspent.dogeord.io/'
const MARKETPLACE_BACKEND_API = import.meta.env.VITE_MARKETPLACE_BACKEND_API || 'https://marketplace-api.dogeord.io/'
const PENDING_D20_BALANCE_API = import.meta.env.VITE_PENDING_D20_BALANCE_API || 'https://wallet-api-dev.dogeord.io/'

type ProtocolMessage = {
  p: string
  op: string
  tick: string
  amt: string
}

type D20Transaction = {
  tick: string
  protocolMessage: ProtocolMessage
  tx: string
  receiver: string
  sender: string
  inscriptionId: string
}

type PendingBalanceData = {
  d20Transactions: D20Transaction[]
  balance: string
}

export type PendingBalanceDatas = {
  [tick: string]: PendingBalanceData
}

type UserAccount = {
  address: string
  balances: PendingBalanceDatas
}
export const pendingD20Balances = async (address: string): Promise<UserAccount> => {
  try {
    const api = axios.create({
      baseURL: PENDING_D20_BALANCE_API,
    })
    const { data }: { data: UserAccount } = await api.get(`pending-balance/${address}`)
    return data
  } catch (err) {
    console.log('error fetching pending d20 balances', err)
    return {
      address,
      balances: {},
    }
  }
}

export const drc20TrustLevel = async (tick: string) => {
  try {
    const { data } = await axios.get(DRC20_API + 'ticks/list/verified/', {
      params: {
        filterByTick: tick,
      },
    })
    return data.data.length > 0 && data.data[0].trustLevel ? data.data[0].trustLevel : 1
  } catch (err) {
    console.log('error fetching trust level', err)
    // caution = 0, normal = 1, trusted = 2
    return 0
  }
}

export const resolveListingPrice = async (inscriptionId: string) => {
  const { data } = await axios.get(MARKETPLACE_BACKEND_API + 'offer/drc20/', {
    params: {
      inscriptionId: inscriptionId,
    },
  })

  return data.offer ? data.offer.price : 0
}

type GetImageInscriptions = {
  address: string
  cursor: number
  size: number
}

export type InscriptionData = {
  inscriptionNumber: number
  inscriptionId: string
  address: string
  outputValue: number
  preview: string
  content: string
  contentLength: number
  contentType: string
  contentBody: string
  timestamp: number
  genesisTransaction: string
  location: string
  output: string
  offset: number
}

type GetImageInscriptionsResponse = {
  status: string
  message: string
  result: {
    list: Array<InscriptionData>
    total: number
  }
}

export const getImageInscriptions = async ({ address, cursor, size }: GetImageInscriptions) => {
  try {
    const { data } = await axios.get<GetImageInscriptionsResponse>(WALLET_API + 'address/inscriptions/', {
      params: {
        address,
        cursor,
        size,
      },
    })

    return data.result
  } catch (err) {
    console.log('error fetching image inscriptions', err)
    return { list: [], total: 0 }
  }
}

export const getDrc20Balance = async (address: string) => {
  const { data } = await axios.get(DRC20_API + 'balances/' + address)
  console.log("asdfasdfasdf", data);
  return data.balanceData ? data.balanceData : []
}

export const postRefreshInscriptions = async (address: string) => {
  const { data } = await axios.post(UTXO_SERVICE_API + 'api/v1/address/refresh', {
    address,
  })

  return data
}

export const getDrc20TransferInscriptions = async (address: string, tick: string) => {
  const { data } = await axios.get(WALLET_API + 'brc20/transferable-list', {
    params: {
      address,
      ticker: tick,
      cursor: 0,
      size: 10000,
    },
  })

  if (data.status === '1' && data.result && data.result.list) {
    return data.result.list
  }

  return []
}

export type GetDrc20List = { list: Array<Drc20Data>; total: number; DOGEprice: number }
export type GetDrc20Data = { drc20Data: Drc20Data }

export const getDrc20List = async (offset: number, limit: number, filterByTick?: string) => {
  return await executeAsync(
    async () =>
      await axios.get<GetDrc20List>(`${MARKETPLACE_BACKEND_API}drc20/list`, {
        params: {
          offset,
          limit,
          filterByTick,
        },
      })
  )
}

export const getDrc20Data = async (tick: string) => {
  return await executeAsync(async () => await axios.get<Drc20Data>(`${MARKETPLACE_BACKEND_API}drc20/data?tick=${tick}`))
}

export type GetDoginalCollections = {
  collections: Array<DoginalsCollection>
  total: number
}

export const getAllDoginalCollections = async (
  offset: number,
  limit: number,
  filterByName?: string,
  sortOrder?: 'asc' | 'desc',
  sortParam?: 'volume' | 'price'
) => {
  return await executeAsync(
    async () =>
      await axios.get<GetDoginalCollections>(MARKETPLACE_BACKEND_API + 'doginals/list', {
        params: {
          limit,
          offset,
          filterByName,
          sortOrder,
          sortParam,
        },
      })
  )
}

export const getDrc20OfferList = async (
  tick: string,
  offset: number,
  limit: number,
  sortOrder: string,
  sortParam: string,
  status: string = 'listed'
) => {
  const { data } = await axios.get(MARKETPLACE_BACKEND_API + 'offer/drc20/list', {
    params: {
      tick: tick,
      offset: offset,
      limit: limit,
      sortOrder,
      sortParam,
      status,
    },
  })

  return data
}
4
export const refreshDoginalOfferStatus = async (inscriptionId: string) => {
  return await executeAsync(
    async () =>
      await axios.put<PutRefreshStatus>(
        `${MARKETPLACE_BACKEND_API}offer/doginals/refresh-status?inscriptionId=${inscriptionId}`
      )
  )
}

export const getDoginalsOffersList = async (
  collectionSymbol?: string,
  seller?: string,
  status?: 'listed' | 'sold' | 'unlisted'
) => {
  const params: Record<string, any> = {
    offset: 0,
    limit: 100,
  }

  if (collectionSymbol) {
    params.collectionSymbol = collectionSymbol
  }

  if (seller) {
    params.seller = seller
  }

  if (status) {
    params.status = status
  }

  const { data } = await axios.get(MARKETPLACE_BACKEND_API + 'offer/doginals/listings', {
    params,
  })

  return data.offers
}

export type ActionTypeKeys = 'sale' | 'list' | 'unlist'

type GetDrc20OfferActivity = {
  tick: string
  offset: string
  limit?: string
  action?: ActionTypeKeys
}

type Drc20OfferActivity = {
  tick: string
  inscriptionId: string
  inscriptionNumber: number
  type: ActionTypeKeys
  price: number
  totalPrice: number
  amount: number
  from: string
  to: string
  createdAt: string
}

type GetDrc20OfferActivityResponse = {
  activities: Array<Drc20OfferActivity>
  total: number
}

export const getDrc20Activity = async ({ tick, offset, limit, action }: GetDrc20OfferActivity) => {
  const { data } = await axios.get<GetDrc20OfferActivityResponse>(MARKETPLACE_BACKEND_API + 'offer/drc20/activity', {
    params: {
      tick,
      action,
      offset,
      limit,
    },
  })

  return data
}

export const getDoginalOfferActivity = async (collectionSymbol: string, action?: 'sale' | 'list' | 'unlist') => {
  const { data } = await axios.get(MARKETPLACE_BACKEND_API + 'offer/doginals/activity', {
    params: {
      collectionSymbol,
      action,
    },
  })

  return data.activityList
}

export const getPsdtFromOfferId = async (offerId: string, type: 'drc20' | 'doginals') => {
  const { data } = await axios.get(`${MARKETPLACE_BACKEND_API}offer/${type}/psdt-hex?offerId=${offerId}`)

  if (data.status !== 0) {
    return data.psdtHex
  } else {
    throw new Error('No such offer id')
  }
}

export const getBuyerPsdtHex = async (
  buyerAddress: string,
  inscriptionPrice: number,
  sellerPsdtHex: string,
  minerFee: number
) => {
  const { data } = await axios.post(MARKETPLACE_BACKEND_API + 'psdt/buyer/create', {
    buyerAddress: buyerAddress,
    inscriptionPrice: inscriptionPrice,
    sellerPsdtHex: sellerPsdtHex,
    minerFee: minerFee,
  })

  return data.buyerPsdtHex
}

export const getSellerPsdtHex = async (
  sellerAddress: string,
  inscriptionPrice: number,
  transactionId: string,
  transactionOutput: number,
  discount: boolean
) => {
  try {
    const { data } = await axios.post(MARKETPLACE_BACKEND_API + 'psdt/seller/create', {
      sellerAddress: sellerAddress,
      inscriptionPrice: inscriptionPrice,
      transactionId: transactionId,
      transactionOutput: transactionOutput,
      discount: discount,
    })

    return data.sellerPsdtHex
  } catch (e) {
    throw new Error('Error: ' + e)
  }
}

export const getCancelPsdtHex = async (sellerAddress: string, transactionId: string, transactionOutput: number) => {
  const { data } = await axios.post(MARKETPLACE_BACKEND_API + 'psdt/seller/cancel', {
    sellerAddress,
    transactionId,
    transactionOutput,
    minerFee: MINER_FEE,
  })

  return data.sellerCancelPsdtHex
}

export const createDrc20Offer = async (psdtHex: string) => {
  const url = MARKETPLACE_BACKEND_API + 'offer/drc20/create'
  const requestBody = {
    psdtHex: psdtHex,
  }

  return await axios.post(url, requestBody)
}

export const getUtxoFromInscriptionId = async (inscriptionId: string) => {
  const { data } = await axios.get(WALLET_API + 'inscription/utxo', {
    params: {
      inscriptionId: inscriptionId,
    },
  })

  if (data.status === 0) {
    throw new Error(data.message)
  }

  return data.result
}

export const buyDrc20Offer = async (offerId: string, psdtHex: string, buyer: string) => {
  const url = MARKETPLACE_BACKEND_API + 'drc20/buy'
  const requestBody = {
    offerId: offerId,
    psdtHex: psdtHex,
    buyer: buyer,
  }

  return await axios.post(url, requestBody)
}

export const isWhitelistAddress = async (address: string) => {
  try {
    const { data } = await axios.get(MARKETPLACE_BACKEND_API + `whitelist/${address}/status`)
    return data.whitelisted
  } catch (e) {
    console.log("Can't get whitelist addresses")
    return false
  }
}

export const getDoginalCollectionsWhitelist = async (address: string) => {
  try {
    const { data } = await axios.get(MARKETPLACE_BACKEND_API + `whitelist/doginalCollections/${address}`)
    return data.whitelistedDoginalCollections
  } catch (e) {
    console.log("Can't get whitelist addresses")
    return []
  }
}

type GetRandomMessage = {
  randomMessage: string
}

type GetAccessToken = {
  accessToken: string
}

export const getRandomMessage = async (address: string) => {
  return await executeAsync(
    async () => await axios.get<GetRandomMessage>(`${MARKETPLACE_BACKEND_API}auth/message?address=${address}`)
  )
}

export const generateAccessToken = async (address: string, message: string, pubkey: string, signature: string) => {
  return await executeAsync(
    async () =>
      await axios.get<GetAccessToken>(
        `${MARKETPLACE_BACKEND_API}auth/token?address=${address}&message=${message}&pubkey=${pubkey}&signature=${encodeURIComponent(
          signature
        )}`
      )
  )
}

export const unlistDrc20Offer = async (offerId: string, address: string) => {
  return await executeAsync(
    async () =>
      await axios.put(
        `${MARKETPLACE_BACKEND_API}offer/drc20/unlist?offerId=${offerId}`,
        {},
        {
          headers: { Authorization: `Bearer ${(window as any).dogeLabsJwt[address]}` },
        }
      )
  )
}

export const unlistDoginalOffer = async (offerId: string, address: string) => {
  return await executeAsync(
    async () =>
      await axios.put(
        `${MARKETPLACE_BACKEND_API}offer/doginals/unlist?offerId=${offerId}`,
        {},
        {
          headers: { Authorization: `Bearer ${(window as any).dogeLabsJwt[address]}` },
        }
      )
  )
}

type GetDrc20Offer = {
  offer: Drc20Offer
  timestamp: string
}

export const getDrc20Offer = async (inscriptionId: string) => {
  return await executeAsync(
    async () => await axios.get<GetDrc20Offer>(`${MARKETPLACE_BACKEND_API}offer/drc20?inscriptionId=${inscriptionId}`)
  )
}

type GetDoginalOffer = {
  offer: DoginalOffer
  timestamp: string
}

export const getDoginalOffer = async (inscriptionId: string) => {
  const { data } = await axios.get<GetDoginalOffer>(
    `${MARKETPLACE_BACKEND_API}offer/doginal?inscriptionId=${inscriptionId}`
  )
  return data
}

type GetDogecoinPriceInUsd = {
  dogePriceInUsd: number
}

export const getDogecoinPriceInUsd = async () => {
  return await executeAsync(
    async () => await axios.get<GetDogecoinPriceInUsd>(`${MARKETPLACE_BACKEND_API}config/doge/price`)
  )
}

type GetIsWhitelistedUd = {
  address: string
  whitelisted: boolean
}

export const getIsWhitelistedUd = async (address: string) => {
  return await executeAsync(
    async () => await axios.get<GetIsWhitelistedUd>(`${MARKETPLACE_BACKEND_API}whitelist/${address}/status-ud`)
  )
}

export const getInscriptionContent = async (inscriptionId: string) => {
  return await executeAsync(async () => await axios.get(`https://wonky-ord.dogeord.io/content/${inscriptionId}`))
}

type PutRefreshStatus = {
  valid: boolean
}

export const refreshDrc20OfferStatus = async (inscriptionId: string) => {
  return await executeAsync(
    async () =>
      await axios.put<PutRefreshStatus>(
        `${MARKETPLACE_BACKEND_API}offer/drc20/refresh-status?inscriptionId=${inscriptionId}`
      )
  )
}

export const createDoginalCollection = async (collectionData: DoginalsCollectionDto, address: string) => {
  return await executeAsync(async () => {
    const response = await axios.post(`${MARKETPLACE_BACKEND_API}doginals/collection`, collectionData, {
      headers: { Authorization: `Bearer ${(window as any).dogeLabsJwt[address]}` },
    })
    return response.data.collection
  })
}

// Function to create individual doginals
export const createDoginal = async (dogeData: DoginalsCollectionData, address: string) => {
  const response = await axios.post(`${MARKETPLACE_BACKEND_API}doginals/doginal/create`, dogeData, {
    headers: { Authorization: `Bearer ${(window as any).dogeLabsJwt[address]}` },
  })
  return response.data.doginals
}

// Function to retrieve information about a specific doginal collection
export const getDoginalCollectionInfo = async (collectionSymbol: string) => {
  try {
    const response = await axios.get(
      `${MARKETPLACE_BACKEND_API}doginals/collection-info?collectionSymbol=${collectionSymbol}`
    )
    return response.data
  } catch (error) {
    console.error('Error retrieving doginal collection info:', error)
    throw error
  }
}
export const getCollectionMetadata = async (collectionSymbol: string) => {
  try {
    const response = await axios.get(
      `${MARKETPLACE_BACKEND_API}doginals/collection-metadata?collectionSymbol=${collectionSymbol}`
    )
    return response.data
  } catch (error) {
    console.error('Error retrieving doginal collection metadata:', error)
    throw error
  }
}

// Function to retrieve doginals associated with a specific collection
export const getDoginalsFromCollection = async (
  collectionSymbol: string,
  limit: number,
  offset: number,
  sortOrder: string,
  metadataKey?: string,
  metadataValue?: string,
  listed?: boolean
): Promise<{ total: number; doginals: Doginal[] }> => {
  try {
    const params: Record<string, any> = {
      collectionSymbol,
      limit,
      offset,
      sortOrder,
      ...(metadataKey && metadataValue ? { metadataKey, metadataValue } : {}),
    }

    if (listed !== undefined) {
      params.listed = listed
    }

    const response = await axios.get(`${MARKETPLACE_BACKEND_API}doginals/collection`, {
      params,
    })

    return {
      total: response.data.total,
      doginals: response.data.doginals,
    }
  } catch (error) {
    console.error('Error retrieving collection doginals:', error)
    throw error
  }
}

// Function to retrieve information about a specific doginal
export const getDoginalInfo = async (inscriptionId: string) => {
  try {
    const response = await axios.get(
      `${MARKETPLACE_BACKEND_API}doginals/collection/token?inscriptionId=${inscriptionId}`
    )
    return response.data.token
  } catch (error) {
    console.error('Error retrieving doginal info:', error)
    throw error
  }
}

// Function to buy a doginal offer
export const buyDoginal = async (offerId: string, psdtHex: string, buyer: string) => {
  const url = `${MARKETPLACE_BACKEND_API}doginals/buy`
  const requestBody = {
    offerId: offerId,
    psdtHex: psdtHex,
    buyer: buyer,
  }

  try {
    const response = await axios.post(url, requestBody)
    return response.data
  } catch (error) {
    console.error('Error buying doginal offer:', error)
    throw error
  }
}

// Function to retrieve the balance of doginals associated with a specific address
export const getDoginalsBalance = async (doginalBalanceQuery: DoginalBalanceQuery) => {
  try {
    const { address, cursor, size } = doginalBalanceQuery
    const response = await axios.get(
      `${MARKETPLACE_BACKEND_API}doginals/balance?address=${address}&cursor=${cursor}&size=${size}`
    )
    return response.data.balance
  } catch (error) {
    console.error('Error retrieving doginals balance:', error)
    throw error
  }
}

export const createDoginalOffer = async (psdtHex: string) => {
  const url = MARKETPLACE_BACKEND_API + 'offer/doginals/create'
  const requestBody = {
    psdtHex: psdtHex,
  }

  return await axios.post(url, requestBody)
}

export const getDoginalCollectionSymbol = async (inscriptionId: string) => {
  const url = `${MARKETPLACE_BACKEND_API}doginals/${inscriptionId}/collection-symbol`
  const response = await axios.get(url)
  return response.data.collectionSymbol
}

export type Feature = {
  header: string
  description: {
    [paragraphNumber: number]: string
  }
  CTAText: string
  CTALink: string
  imageLink: string
  index: number | null
  visible: boolean
}

export type FeatureDto = {
  header: string
  description: {
    [paragraphNumber: number]: string
  }
  CTAText: string
  CTALink: string
  imageLink: string
  visible?: boolean
}

export const createFeature = async (featureDto: FeatureDto, address: string) => {
  const response = await axios.post(`${MARKETPLACE_BACKEND_API}features`, featureDto, {
    headers: { Authorization: `Bearer ${(window as any).dogeLabsJwt[address]}` },
  })

  return response
}

export const getFeatures = async (visible?: boolean) => {
  try {
    const response = await axios.get<Feature[]>(`${MARKETPLACE_BACKEND_API}features`, {
      params: { visible },
    })

    return response.data
  } catch (err) {
    Sentry.captureException(err, {
      extra: {
        visibility: visible,
      },
    })
    console.log('error fetching features', err)
  }
}

export const updateFeatures = async (features: Feature[], address: string) => {
  const response = await axios.put(
    `${MARKETPLACE_BACKEND_API}features`,
    { features },
    {
      headers: { Authorization: `Bearer ${(window as any).dogeLabsJwt[address]}` },
    }
  )

  return response
}
