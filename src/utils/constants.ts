export const ONE_DOGE_IN_SHIBES = 100000000
export const SERVICE_FEE = 0.0333
export const LANDING_PAGE_DRC20_ITEMS_PER_PAGE = 15
export const LANDING_PAGE_DOGE_NFT_ITEMS_PER_PAGE = 15
export const DUST_AMOUNT_AND_MIN_PRICE = 200000000
export const MINER_FEE = 30000000
export const DISCOUNTED_SERVICE_FEE = SERVICE_FEE / 2
export const DOGECOIN_NETWORK = {
  messagePrefix: '\x19Dogecoin Signed Message:\n',
  bip32: {
    public: 0x02facafd,
    private: 0x02fac398,
  },
  pubKeyHash: 0x1e,
  scriptHash: 0x16,
  wif: 0x9e,
  bech32: '',
}

export enum TrustLevel {
  UNTRUSTWORTHY = 0,
  NORMAL = 1,
  TRUSTWORTHY = 2,
}
