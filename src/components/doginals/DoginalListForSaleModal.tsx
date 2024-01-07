import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Tooltip } from 'react-tooltip'

import { createDoginalOffer, getIsWhitelistedUd, getSellerPsdtHex, getUtxoFromInscriptionId } from '@/api'
import useToast from '@/hooks/useToast'
import { DogeNft } from '@/types/dogeNft'
import { DISCOUNTED_SERVICE_FEE, DUST_AMOUNT_AND_MIN_PRICE, ONE_DOGE_IN_SHIBES, SERVICE_FEE } from '@/utils/constants'

type DoginalListForSaleModalProps = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  address: string
  doginal: DogeNft & { listed: boolean }
  dogecoinPriceInUsd: number
  onSuccess: (param?: any) => void
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

const DoginalListForSaleModal = ({
  visible,
  setVisible,
  address,
  doginal,
  dogecoinPriceInUsd,
  onSuccess,
}: DoginalListForSaleModalProps) => {
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
    if (isValidNumber(event.target.value)) {
      setPriceInput(event.target.value)
      setNetworkFee(Number(event.target.value) > 0 ? 1 : 0)
      setServiceFee(
        (Number(event.target.value) * (isDiscountChecked ? DISCOUNTED_SERVICE_FEE : SERVICE_FEE)).toFixed(2)
      )
      setTotalPotentialProceeds(
        (
          Number(event.target.value) -
          Number(event.target.value) * (isDiscountChecked ? DISCOUNTED_SERVICE_FEE : SERVICE_FEE) -
          (Number(event.target.value) > 0 ? 1 : 0)
        ).toFixed(2)
      )
    } else {
      setPriceInput('')
      setServiceFee('0')
      setNetworkFee(0)
      setTotalPotentialProceeds('0')
    }
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

  const closeDoginalListForSaleModal = () => {
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
    const priceInShibes = +priceInput * ONE_DOGE_IN_SHIBES
    try {
      const { txId, outputIndex } = await getUtxoFromInscriptionId(doginal.inscriptionId)
      const psdtHex = await getSellerPsdtHex(address, priceInShibes, txId, outputIndex, isDiscountChecked)
      const signedPsdtHex = await (window as any).dogeLabs.signPsbt(psdtHex)
      const { } = await createDoginalOffer(signedPsdtHex)
      toast.showSuccessToast('Successfully listed')
      closeDoginalListForSaleModal()
    } catch (e) {
      if (e instanceof Error) {
        toast.showErrorToast(`Unable to list: ${e.message}`, { autoClose: 5000 })
      }
      return
    }

    if (onSuccess) {
      onSuccess(doginal)
    }
    setPriceInput('')
  }

  const formatDollarValue = (input: number | string) => {
    return (Number(input) * dogecoinPriceInUsd).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 5,
    })
  }

  return (
    <div className={modalContainerStyle}>
      <div className="flex flex-col px-3 bg-account-info-background rounded-lg border-2 border-account-page-default">
        <div className="flex justify-between items-center my-3">
          <span className="text-sm font-bold">QUICK LIST</span>
          <button onClick={closeDoginalListForSaleModal}>
            <img className="m-1" src="/images/clear.png" alt="Clear"></img>
          </button>
        </div>

        <div className="flex items-center my-3">
          <img
            className="w-10 mr-1"
            src={doginal.content}
            alt={doginal.name}
            onError={(e) => (e.currentTarget.src = '/ticks/noIcon.svg')}
          />

          <div className="flex flex-col">
            <span className="text-sm mx-1 font-medium">{doginal.name + ' (#' + doginal.inscriptionNumber + ')'}</span>
            <div className="flex flex-row mx-1">
              <span className="mr-1 text-light-dark text-xxs">{doginal.name}</span>
              <img className="w-4" src={'/images/verifiedIcon.svg'} alt="Verify Icon" />
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center rounded-lg border-2 border-account-page-default my-3 w-full">
          <div className="flex flex-col rounded-l-lg border-r-2 border-account-page-default w-5/6">
            <div className="flex flex-row items-center mx-2">
              <span className="text-xxs text-selected-color">Set Price</span>
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
              {/* <span className="text-xxxs">~$34.07</span> */}
            </div>
          </div>
          <span className="m-3">DOGE</span>
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
                Service fee ({(isDiscountChecked ? DISCOUNTED_SERVICE_FEE * 100 : SERVICE_FEE * 100).toFixed(2)}%)
              </span>
            </div>
            <div className="flex justify-end text-xxs w-1/3">-{formatNumber(serviceFee)} DOGE</div>
            <div className="text-xxxs flex justify-center w-1/3">~${formatDollarValue(serviceFee)}</div>
          </div>
          <div className="flex justify-between mx-2 py-1 items-center w-full">
            <div className="flex justify-start items-center w-1/3">
              <span className="text-xxs">Network Fee</span>
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
                    https://drc-20.org/labradoges
                  </a>
                </span>
              )}
            />
          </label>
          <div className="flex justify-end text-xxs w-1/3 text-account-info-font text-opacity-50">
            -{formatNumber(Number(priceInput) * DISCOUNTED_SERVICE_FEE)} DOGE
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
          disabled={isValidPrice(priceInput) ? false : true}
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
  )
}

export default DoginalListForSaleModal
