import { getDoginalOffer, getPsdtFromOfferId } from '@/api'
import useToast from '@/hooks/useToast'
import Sentry from '@/main'
import { DoginalOffer } from '@/types/dogeNft'
import { ONE_DOGE_IN_SHIBES } from '@/utils/constants'
import { useWalletContext } from '@/WalletContext'

type DoginalBuyProps = {
  offer: DoginalOffer
  dogecoinPriceInUsd: number
  setShowTxModalVisible: (value: boolean) => void
  setTxHash: (value: string) => void
}
const DoginalBuy = ({ offer, dogecoinPriceInUsd, setShowTxModalVisible, setTxHash }: DoginalBuyProps) => {
  const { balance, address } = useWalletContext()
  const toast = useToast()
  const handleBuyClick = async (doginal: DoginalOffer) => {
    if (balance.total <= Number(doginal.price)) {
      toast.showErrorToast('Unable to purchase: Insufficient balance')
      return
    }

    try {
      const { offer } = await getDoginalOffer(doginal.inscriptionId)
      const sellerPsdtHex = await getPsdtFromOfferId(offer.offerId, 'doginals')

      // Create 3 outputs required for purchasing the offer
      const unsignedBuyerPrePurchaseTx = await (window as any).dogeLabs.createPurchaseOfferInputs(sellerPsdtHex)
      const signedBuyerPrePurchaseTx = await (window as any).dogeLabs.signPsbt(unsignedBuyerPrePurchaseTx)
      const { rawTx } = await (window as any).dogeLabs.pushPsbt(signedBuyerPrePurchaseTx, [], true)

      const buyerPsdtHex = await (window as any).dogeLabs.createBuyerPsdt(sellerPsdtHex, rawTx)
      const signedPsdtHex = await (window as any).dogeLabs.signPsbt(buyerPsdtHex)
      const data = await (window as any).dogeLabs.buyDoginalOffer(offer.offerId, signedPsdtHex, address)

      setTxHash(data.txHash)
      setShowTxModalVisible(true)
    } catch (e) {
      Sentry.captureException(e, {
        extra: {
          address: address,
          balance: balance,
          offer: offer,
          price: dogecoinPriceInUsd,
        },
      })
      if (e instanceof Error) {
        toast.showErrorToast(`Unable to make a purchase: ${e.message}`, { autoClose: 5000 })
      }
    }
  }
  return (
    <div className="flex flex-col items-start border-2 border-account-page-background bg-white rounded-lg p-4 my-2">
      <p className="text-xs ml-0.5">Price</p>
      <p className="font-bold text-lg">
        {' '}
        {(offer.price / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}{' '}
        DOGE
      </p>
      <span className="text-xxs text-gray-500 tracking-tighter ml-0.5">
        ~$
        {((offer.price / ONE_DOGE_IN_SHIBES) * dogecoinPriceInUsd).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}
      </span>
      <button
        className={`${
          address ? 'bg-selected-color' : 'bg-gray-200'
        } rounded-xl text-white text-base font-bold p-2 w-full mt-2`}
        onClick={async () => await handleBuyClick(offer)}
        disabled={!address}
      >
        {address ? 'Buy now' : 'Connect Wallet'}
      </button>
      <span className="pt-4 text-left">
        By clicking “Buy now”, you confirm the accuracy of the input data and agree to the{' '}
        <a href="/legal/terms" target="_blank" rel="noreferrer" className="underline">
          Terms of Use
        </a>
        .
      </span>
    </div>
  )
}

export default DoginalBuy
