import React, { useState } from 'react';
import { getCancelPsdtHex, getDrc20Offer, getUtxoFromInscriptionId, unlistDrc20Offer } from '@/api'
import useToast from '@/hooks/useToast'
import { TransferInscription } from '@/types/transferInscriptions'
import { generateJwt } from '@/utils/helpers'

import CustomToastContainer from '../CustomToastContainer'

type Drc20CancelModalProps = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  transferInscription: TransferInscription
  address: string
}

const Drc20CancelModal = ({ visible, setVisible, transferInscription, address }: Drc20CancelModalProps) => {
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const modalContainerStyle = `fixed left-0 top-0 right-0 bottom-0 bg-account-info-background bg-opacity-10 flex items-center justify-center
   ${
     visible
       ? 'opacity-100 z-50 backdrop-blur-sm transition-[opacity]'
       : 'opacity-0 -z-50 backdrop-blur-none transition-[z-index,opacity]'
   }`

  const closeDrc20CancelModal = () => {
    setVisible(false)
  }

  const handleCancelListing = async () => {
    setLoading(true)
    const { res: drc20OfferRes, err: drc20OfferErr } = await getDrc20Offer(transferInscription.inscriptionId)

    if (drc20OfferErr) {
      setLoading(false)
      throw new Error(`Unable to load offer: ${drc20OfferErr.message}`)
    }

    const { txId, outputIndex } = await getUtxoFromInscriptionId(transferInscription.inscriptionId)
    const unsignedCancelTx = await getCancelPsdtHex(address, txId, outputIndex)
    const signedCancelTx = await (window as any).dogeLabs.signPsbt(unsignedCancelTx)
    const { rawTx } = await (window as any).dogeLabs.pushPsbt(signedCancelTx, [], true)
    console.log('cancel drc20 rawTx', rawTx)

    if (drc20OfferRes && drc20OfferRes.data.offer.offerId) {
      // @TODO: add txHash to unlistDrc20Offer call
      const { res, err: unlistDrc20OfferErr } = await unlistDrc20Offer(drc20OfferRes!.data.offer.offerId, address)
      res;
      if (unlistDrc20OfferErr) {
        await generateJwt(address)
        const { res, err } = await unlistDrc20Offer(drc20OfferRes!.data.offer.offerId, address)
        res;
        if (err) {
          setLoading(false)
          throw new Error(`Unable to unlist offer: ${err.message}`)
        }
      }
    }

    // remove offer from Mongo database also (create a route for that)
    transferInscription.listingPrice = 0
    setLoading(false)
    setVisible(false)
  }

  return (
    <div className={modalContainerStyle}>
      <CustomToastContainer />
      <div className="flex flex-col px-3 bg-account-info-background rounded-lg border-2 border-account-page-default my-1" style={{color:'#000'}}>
        <div className="flex justify-between items-center my-3">
          <span className="text-sm font-bold">CANCEL LISTING</span>
          <button onClick={closeDrc20CancelModal}>
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
            onClick={closeDrc20CancelModal}
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
  )
}

export default Drc20CancelModal
