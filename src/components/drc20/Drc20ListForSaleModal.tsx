import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Tooltip } from 'react-tooltip'

import { createDrc20Offer, getIsWhitelistedUd, getSellerPsdtHex, getUtxoFromInscriptionId } from '@/api'
import useToast from '@/hooks/useToast'
import { TransferInscription } from '@/types/transferInscriptions'
import { DISCOUNTED_SERVICE_FEE, DUST_AMOUNT_AND_MIN_PRICE, ONE_DOGE_IN_SHIBES, SERVICE_FEE } from '@/utils/constants'

import CustomToastContainer from '../CustomToastContainer'

type Drc20ListForSaleModalProps = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  address: string
  transferInscription: TransferInscription
  dogecoinPriceInUsd: number
}

const isValidNumber = (num: string) => {
  if (isNaN(+num)) {
    return false
  }

  return true
}

const isValidPrice = (num: string) => {
  if (+num < DUST_AMOUNT_AND_MIN_PRICE / ONE_DOGE_IN_SHIBES) {
    return false
  }

  return true
}

const formatNumber = (input: number | string) => {
  return Number(input).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })
}

export const MIN_DRC20_LISTING_PRICE_DOGE = 2

const Drc20ListForSaleModal = ({
  visible,
  setVisible,
  address,
  transferInscription,
  dogecoinPriceInUsd,
}: Drc20ListForSaleModalProps) => {
  const modalContainerStyle = `fixed left-0 top-0 right-0 bottom-0 bg-account-info-background bg-opacity-10 flex items-center justify-center
   ${
     visible
       ? 'opacity-100 z-50 backdrop-blur-sm transition-[opacity]'
       : 'opacity-0 -z-50 backdrop-blur-none transition-[z-index,opacity]'
   }`

  const [priceInput, setPriceInput] = useState<string>('')
  const priceInputRef = useRef<HTMLInputElement | null>(null)
  const [serviceFee, setServiceFee] = useState<string>('0')
  const [totalPotentialProceeds, setTotalPotentialProceeds] = useState<string>('0')
  const [networkFee, setNetworkFee] = useState<number>(0)

  const [_isPriorityChecked, _setIsPriorityChecked] = useState<boolean>(false)
  const [isDiscountChecked, setIsDiscountChecked] = useState<boolean>(false)
  const [isWhitelistedUd, setIsWhitelistedUd] = useState<boolean>(false)

  const toast = useToast()

  const handlePriceValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isValidNumber(event.target.value)) {
      setPriceInput('')
      setServiceFee('0')
      setNetworkFee(0)
      setTotalPotentialProceeds('0')
    }

    setPriceInput(event.target.value)
    setNetworkFee(Number(event.target.value) > 0 ? 1 : 0)
    setServiceFee((Number(event.target.value) * (isDiscountChecked ? DISCOUNTED_SERVICE_FEE : SERVICE_FEE)).toFixed(2))
    setTotalPotentialProceeds(
      (
        Number(event.target.value) -
        Number(event.target.value) * (isDiscountChecked ? DISCOUNTED_SERVICE_FEE : SERVICE_FEE) -
        (Number(event.target.value) > 0 ? 1 : 0)
      ).toFixed(2)
    )
  }

  useEffect(() => {
    const fetchIsWhitelistedUd = async () => {
      const { res, err } = await getIsWhitelistedUd(address)

      if (err) {
        console.log(err)
        return
      }

      setIsWhitelistedUd(res!.data.whitelisted)
      setIsDiscountChecked(res!.data.whitelisted)
    }

    fetchIsWhitelistedUd()
  }, [address])

  useEffect(() => {
    setServiceFee((Number(priceInput) * (isDiscountChecked ? DISCOUNTED_SERVICE_FEE : SERVICE_FEE)).toFixed(2))
    setTotalPotentialProceeds(
      (
        Number(priceInput) -
        Number(priceInput) * (isDiscountChecked ? DISCOUNTED_SERVICE_FEE : SERVICE_FEE) -
        (Number(priceInput) > 0 ? 1 : 0)
      ).toFixed(2)
    )
  }, [isDiscountChecked, priceInput])

  const closeDrc20ListForSaleModal = () => {
    setVisible(false)
  }

  /*
  const handlePriorityCheckbox = () => {
    setIsPriorityChecked(!isPriorityChecked)
  }
  */

  const handleDiscountCheckbox = () => {
    setIsDiscountChecked(!isDiscountChecked)
  }

  const handleListButtonClick = async () => {
    if (priceInput !== '' && +priceInput < MIN_DRC20_LISTING_PRICE_DOGE) {
      toast.showErrorToast(`Minimum listing price must be ${MIN_DRC20_LISTING_PRICE_DOGE} DOGE`)

      return
    }

    const priceInShibes = +priceInput * ONE_DOGE_IN_SHIBES
    try {
      const { txId, outputIndex } = await getUtxoFromInscriptionId(transferInscription.inscriptionId)
      const psdtHex = await getSellerPsdtHex(address, priceInShibes, txId, outputIndex, isDiscountChecked)
      const signedPsdtHex = await (window as any).dogeLabs.signPsbt(psdtHex)
      const { data } = await createDrc20Offer(signedPsdtHex)
      data;
    } catch (e) {
      return
    }
    transferInscription.listingPrice = priceInShibes
    setVisible(false)
    setPriceInput('')
  }

  const formatDollarValue = (input: number | string) => {
    return (Number(input) * dogecoinPriceInUsd).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 5,
    })
  }

  return (
    <>
      <CustomToastContainer />
      <div className={modalContainerStyle}>
        <div className="flex flex-col px-3 bg-account-info-background rounded-lg border-2 border-account-page-default" style={{color:'#000'}}>
          <div className="flex justify-between items-center my-3">
            <span className="text-sm font-bold">QUICK LIST</span>
            <button onClick={closeDrc20ListForSaleModal}>
              <img className="m-1" src="/images/clear.png" alt="Clear"></img>
            </button>
          </div>

          <div className="flex items-center my-3">
            <img
              className="w-10 mr-1"
              src={`https://drc-20-icons.s3.eu-central-1.amazonaws.com/${transferInscription.tick.toLowerCase()}.png`} // hardcoded - change to original pic if exists for particular drc20
              alt={transferInscription.tick}
              onError={(e) => (e.currentTarget.src = '/ticks/noIcon.svg')}
            />
            <div className="flex flex-col">
              <span className="text-sm mx-1 font-medium">
                {transferInscription.amount.toString() +
                  ' ' +
                  transferInscription.tick +
                  ' (#' +
                  transferInscription.inscriptionNumber +
                  ')'}
              </span>
              <div className="flex flex-row mx-1">
                <span className="mr-1 text-light-dark text-xxs">{transferInscription.tick}</span>
                {transferInscription.verified === 2 && (
                  <img src={'/ticks/verify.png'} alt="verified" className="h-3 w-3" />
                )}
                {transferInscription.verified === 0 && (
                  <img src={'/ticks/caution.png'} alt="caution" className="h-3 w-3" />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center rounded-lg border-2 border-account-page-default my-3 w-full">
            <div className="flex flex-col rounded-l-lg border-r-2 border-account-page-default w-5/6">
              <div className="flex flex-row items-center mx-2">
                <span className="text-xxs text-selected-color">Set Total Price</span>
                <img
                  className="m-1"
                  src="/images/info.svg"
                  alt="Info mark"
                  data-tooltip-id="set-price-tooltip"
                  data-tooltip-content="Set the total price for the total number of tokens within your inscription. Min price is 2 DOGE."
                ></img>
                <Tooltip
                  className="max-w-72 md:max-w-144"
                  id="set-price-tooltip"
                  place="top"
                  delayShow={100}
                  delayHide={100}
                />
              </div>
              <div className="flex flex-row items-center">
                <input
                  ref={priceInputRef}
                  className="mx-2 my-0.5 outline-none border-none text-sm"
                  type="text"
                  value={priceInput}
                  onChange={handlePriceValueChange}
                  placeholder="Enter price"
                />
                <span className="text-xxxs">~${formatDollarValue(priceInput)}</span>
              </div>
            </div>
            <span className="m-3 w-28 text-left">DOGE</span>
          </div>

          <div className="flex flex-row items-center rounded-lg border-2 border-account-page-default my-3 w-full">
            <div className="flex flex-col rounded-l-lg border-r-2 border-account-page-default w-5/6">
              <div className="flex flex-row items-center mx-2">
                <span className="text-xxs text-selected-color">Token Price</span>
                <img
                  className="m-1"
                  src="/images/info.svg"
                  alt="Info mark"
                  data-tooltip-id="token-price-tooltip"
                  data-tooltip-content="Reflecting the resulting price per token based on your total price and amount of tokens in your inscription."
                ></img>
                <Tooltip
                  className="max-w-72 md:max-w-144"
                  id="token-price-tooltip"
                  place="top"
                  delayShow={100}
                  delayHide={100}
                />
              </div>
              <div className="flex flex-row items-center">
                <input
                  className="mx-2 my-0.5 outline-none border-none text-sm bg-white"
                  type="text"
                  value={Number(priceInput) / transferInscription.amount}
                  disabled={true}
                />
                <span className="text-xxxs">
                  ~${formatDollarValue(Number(priceInput) / transferInscription.amount)}
                </span>
              </div>
            </div>
            <span className="m-3 w-28 text-left">DOGE per {transferInscription.tick}</span>
          </div>

          <div className="flex flex-col justify-center rounded-lg border-2 border-account-page-default mt-3">
            <div className="flex justify-between mx-2 py-1 items-center w-full">
              <div className="flex justify-start items-center w-1/3">
                <span className="text-xxs">Total price</span>
                <img
                  className="ml-1"
                  src="/images/info.svg"
                  alt="Info mark"
                  data-tooltip-id="set-price-tooltip"
                  data-tooltip-content="You will not be able to change the price after listing. If you'd like to change the price, you will need to create a new listing."
                ></img>
              </div>
              <div className="flex justify-end text-xxs w-1/3">{priceInput ? formatNumber(priceInput) : 0} DOGE</div>
              <div className="text-xxxs flex justify-center w-1/3">
                ~$
                {formatDollarValue(priceInput)}
              </div>
            </div>
            <div className="flex justify-between mx-2 py-1 items-center w-full">
              <div className="flex justify-start items-center w-1/3">
                <span className="text-xxs whitespace-nowrap">
                  - Service fee ({(isDiscountChecked ? DISCOUNTED_SERVICE_FEE * 100 : SERVICE_FEE * 100).toFixed(2)}%)
                </span>
              </div>
              <div className="flex justify-end text-xxs w-1/3">-{formatNumber(serviceFee)} DOGE</div>
              <div className="text-xxxs flex justify-center w-1/3">~${formatDollarValue(serviceFee)}</div>
            </div>
            <div className="flex justify-between mx-2 py-1 items-center w-full">
              <div className="flex justify-start items-center w-1/3">
                <span className="text-xxs">- Network Fee</span>
              </div>
              <div className="flex justify-end text-xxs w-1/3">-{formatNumber(networkFee)} DOGE</div>
              <div className="text-xxxs flex justify-center w-1/3">~${formatDollarValue(networkFee)}</div>
            </div>

            {/* <div className="flex justify-between mx-2 py-1 items-center w-full">
            <label className="flex justify-start items-center space-x-1 w-1/3">
              <input
                type="checkbox"
                checked={isPriorityChecked}
                onChange={handlePriorityCheckbox}                           // Priority fee
                disabled={true}
                className="form-checkbox text-xxs border-account-info-font border-opacity-50"
              />
              <span className="text-account-info-font text-xxs text-opacity-50">Priority</span>
            </label>
            <div className="flex justify-end text-xxs w-1/3 text-account-info-font text-opacity-50">-0.00 DOGE</div>
            <div className="text-xxxs flex justify-center w-1/3 text-account-info-font text-opacity-50">~$0.00</div>
          </div> */}
          </div>

          <div className="flex flex-row rounded-lg bg-account-page-default my-2 items-center">
            <label className="flex justify-start items-center mx-2 space-x-1 w-1/3">
              <input
                type="checkbox"
                checked={isDiscountChecked}
                onChange={handleDiscountCheckbox}
                disabled={isWhitelistedUd ? false : true}
                className="form-checkbox text-xxs border-account-info-font border-opacity-50"
              />
              <img className="m-1" src="/images/dogeLabsIcon.png" alt="Doge Labs Icon"></img>
              <span className="text-account-info-font text-xxs text-opacity-50 whitespace-nowrap">Discount (50%)</span>
              <img
                className="ml-1"
                src="/images/info.svg"
                alt="Info mark"
                data-tooltip-id="discount-tooltip"
                data-tooltip-content="Want to save 50% off on marketplace fees? Grab yourself an Investor Pack before they're gone:"
              ></img>
              <Tooltip
                className="max-w-72 md:max-w-144"
                id="discount-tooltip"
                place="top"
                delayShow={100}
                delayHide={100}
                clickable={true}
                render={({ content }) => (
                  <span>
                    {content}{' '}
                    <a className="underline" href="/labradoges" target="_blank">
                      https://drcfront.web.app/labradoges
                    </a>
                  </span>
                )}
              />
            </label>
            <div className="flex justify-end text-xxs w-1/3 text-account-info-font text-opacity-50">
              +{formatNumber(Number(priceInput) * DISCOUNTED_SERVICE_FEE)} DOGE
            </div>
            <div className="text-xxxs flex justify-center w-1/3 text-account-info-font text-opacity-50 pl-1">
              ~${formatDollarValue(Number(priceInput) * DISCOUNTED_SERVICE_FEE)}
            </div>
          </div>

          <div className="flex justify-between mx-2 mt-1 items-center w-full">
            <div className="flex justify-start items-center w-1/3">
              <span className="text-sm font-bold whitespace-nowrap">Total potential proceeds</span>
            </div>
            <div className="flex justify-end text-sm font-bold w-1/3 truncate">
              {formatNumber(totalPotentialProceeds)} DOGE
            </div>
            <div className="text-xxxs font-bold flex justify-center w-1/3">
              ~${formatDollarValue(totalPotentialProceeds)}
            </div>
          </div>

          <button
            className={`${
              isValidPrice(priceInput) ? 'bg-selected-color' : 'bg-gray-200'
            } font-semibold text-white text-lg rounded-lg px-5 py-1 my-3`}
            onClick={handleListButtonClick}
            disabled={!isValidPrice(priceInput)}
            title={`${isValidPrice(priceInput) ? '' : 'Enter valid price'}`}
          >
            List now
          </button>

          <div className="text-12px m-2">
            By clicking “List now”, you confirm the accuracy of the input data and agree to the{' '}
            <a className="underline" href="/legal/terms" target="_blank">
              Terms of Use
            </a>
            .
          </div>
        </div>
      </div>
    </>
  )
}

export default Drc20ListForSaleModal
