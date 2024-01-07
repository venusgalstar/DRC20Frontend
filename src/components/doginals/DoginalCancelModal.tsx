import React, { useState } from 'react';
import {
    getCancelPsdtHex,
    getDoginalOffer,
    //getDrc20Offer,
    //getPsdtFromOfferId,
    getUtxoFromInscriptionId,
    unlistDoginalOffer,
    //unlistDrc20Offer,
  } from '@/api'
  import useToast from '@/hooks/useToast'
  import { DogeNft } from '@/types/dogeNft'
  import { generateJwt } from '@/utils/helpers'
  import { useWalletContext } from '@/WalletContext'
  
  import CustomToastContainer from '../CustomToastContainer'
  
  type Drc20CancelModalProps = {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    doginal: DogeNft & { listed: boolean; unlisted: boolean }
    address: string
    onSuccess: (param?: any) => void
  }
  
  const DoginalCancelModal = ({ visible, setVisible, doginal, onSuccess }: Drc20CancelModalProps) => {
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const modalContainerStyle = `fixed left-0 top-0 right-0 bottom-0 bg-account-info-background bg-opacity-10 flex items-center justify-center
     ${
       visible
         ? 'opacity-100 z-50 backdrop-blur-sm transition-[opacity]'
         : 'opacity-0 -z-50 backdrop-blur-none transition-[z-index,opacity]'
     }`
  
    const closeDoginalCancelModal = () => {
      setVisible(false)
    }
  
    const { address } = useWalletContext()
  
    const handleCancelListing = async () => {
      setLoading(true)
      let offer = null
      if (!doginal.unlisted) {
        const offerResult = await getDoginalOffer(doginal.inscriptionId)
        offer = offerResult.offer
      }
  
      // Cancel listing
      const { txId, outputIndex } = await getUtxoFromInscriptionId(doginal.inscriptionId)
      const unsignedCancelTx = await getCancelPsdtHex(address, txId, outputIndex)
      const signedCancelTx = await (window as any).dogeLabs.signPsbt(unsignedCancelTx)
      const { rawTx } = await (window as any).dogeLabs.pushPsbt(signedCancelTx, [], true)
      console.log('cancel doginal rawTx', rawTx)
  
      // @TODO: add txHash to unlistDoginalOffer call
      if (offer) {
        const { res, err: unlistDrc20OfferErr } = await unlistDoginalOffer(offer.offerId, address)
        res;
        if (unlistDrc20OfferErr) {
          await generateJwt(address)
          const { res, err } = await unlistDoginalOffer(offer.offerId, address)
          res;
          if (err) {
            setLoading(false)
            throw new Error(`Unable to unlist offer: ${err.message}`)
          }
        }
      }
  
      setLoading(false)
      if (onSuccess) {
        onSuccess(doginal)
      }
      setVisible(false)
    }
  
    return (
      <>
        <CustomToastContainer />
        <div className={modalContainerStyle}>
          <div className="flex flex-col px-3 bg-account-info-background rounded-lg border-2 border-account-page-default my-1">
            <div className="flex justify-between items-center my-3">
              <span className="text-sm font-bold">CANCEL LISTING</span>
              <button onClick={closeDoginalCancelModal}>
                <img className="m-1" src="/images/clear.png" alt="Clear"></img>
              </button>
            </div>
  
            <div className="text-sm my-1">
              Canceling your listing will unpublish this sale and requires a transaction to make sure it will never be
              fulfillable.
            </div>
  
            <div className="flex flex-row my-1 justify-center">
              <button
                className="bg-account-page-default font-semibold text-black text-lg rounded-lg px-8 py-1 my-3 mx-3"
                onClick={closeDoginalCancelModal}
              >
                Never mind
              </button>
  
              <button
                className={
                  loading
                    ? 'bg-selected-color font-semibold text-white text-lg rounded-lg px-8 py-1 my-3 mx-3 w-64 opacity-50 cursor-not-allowed'
                    : 'bg-selected-color font-semibold text-white text-lg rounded-lg px-8 py-1 my-3 mx-3 w-64'
                }
                disabled={loading}
                onClick={async () => {
                  try {
                    await handleCancelListing()
                    toast.showSuccessToast('Successfully cancelled listing')
                  } catch (e) {
                    if (e instanceof Error) {
                      toast.showErrorToast(e.message)
                    }
                  }
                }}
              >
                {loading ? 'Loading...' : 'Cancel listing'}
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }
  
  export default DoginalCancelModal
  