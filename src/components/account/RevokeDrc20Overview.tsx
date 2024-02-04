import { useEffect, useState } from 'react'
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import { TransferInscription } from '@/types/transferInscriptions'
import { ONE_DOGE_IN_SHIBES } from '@/utils/constants'

import Drc20CancelModal from '../drc20/Drc20CancelModal'

type Drc20OverviewProps = {
  address: string
  transferInscriptions: TransferInscription[]
  searchValue: string
  itemsPerPage: number
  dogecoinPriceInUsd: number
}

const RevokeDrc20Overview = ({
  address,
  transferInscriptions,
  itemsPerPage,
  dogecoinPriceInUsd,
}: Drc20OverviewProps) => {
  const [drc20CancelModalVisible, setDrc20CancelModalVisible] = useState<boolean>(false)

  const [selectedTransferIncription, setSelectedTransferInscription] = useState<TransferInscription>({
    tick: '',
    amount: 0,
    inscriptionId: '',
    inscriptionNumber: 0,
    listingPrice: 0,
    verified: 1,
    unlisted: false,
  })

  const [currentTransferInscriptionsPage, setCurrentTransferInscriptionsPage] = useState<number>(1)
  const [totalTransferInscriptionsPages, setTotalTransferInscriptionsPages] = useState<number>(1)
  const [currentTransferInscriptionsItems, setCurrentTransferInscriptionsItems] = useState<TransferInscription[]>()

  const navigator = useNavigate()

  useEffect(() => {
    if (transferInscriptions) {
      const currentTransferInscriptionsItems = transferInscriptions.slice(
        currentTransferInscriptionsPage === 1 ? 0 : (currentTransferInscriptionsPage - 1) * itemsPerPage,
        currentTransferInscriptionsPage * itemsPerPage
      )

      const totalTransferInscriptionsPages =
        transferInscriptions.length === 0 ? 1 : Math.ceil(transferInscriptions.length / itemsPerPage)

      setCurrentTransferInscriptionsItems(currentTransferInscriptionsItems)
      setTotalTransferInscriptionsPages(totalTransferInscriptionsPages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferInscriptions, currentTransferInscriptionsPage])

  const handleTransferInscriptionsPageChange = (page: number) => {
    setCurrentTransferInscriptionsPage(page)
  }

  const showDrc20CancelModal = (transferInscription: TransferInscription) => {
    setSelectedTransferInscription(transferInscription)
    setDrc20CancelModalVisible(true)
  }

  return (
    <>
      <Drc20CancelModal
        visible={drc20CancelModalVisible}
        setVisible={setDrc20CancelModalVisible}
        transferInscription={selectedTransferIncription}
        address={address}
      />

      <div className="overflow-x-auto overflow-y-hidden">
        <table className="max-w-7xl table-fixed min-w-full">
          <thead className="w-full border-solid border-b-2 ">
            <tr className="w-full">
              <th className="font-normal sticky z-10 table-cell-shadow-right bg-white md:static left-0 md:left-auto whitespace-nowrap py-4 pr-8 md:pr-92 text-xs text-start" style={{backgroundColor:'#000', color:'#fff'}}>
                Item
              </th>
              <th className="font-normal whitespace-nowrap xxs:pl-4 md:pl-0 pr-12 py-4 text-left text-xs">
                Listing price
              </th>
              <th className="font-normal whitespace-nowrap py-4 text-left text-xs">Clear</th>
            </tr>
          </thead>
          <tbody className="">
            {currentTransferInscriptionsItems &&
              currentTransferInscriptionsItems.map((transferInscription) => (
                <tr key={transferInscription.inscriptionNumber}>
                  <td className="sticky z-10 table-cell-shadow-right md:static left-0 bg-white md:left-auto pt-4 text-xs flex justify-start items-center" style={{backgroundColor:'#00000000', color:'#fff'}}>
                    <div className="inline-flex items-center">
                      <img
                        className="md:h-7 md:w-7 w-4 h-4 object-cover rounded-full"
                        src={`https://drc-20-icons.s3.eu-central-1.amazonaws.com/${transferInscription.tick.toLowerCase()}.png`}
                        alt="Drc20"
                        onError={(e) => (e.currentTarget.src = '/ticks/noIcon.svg')}
                      />
                      <span
                        className="ml-1 md:ml-2 mr-0.5 font-normal xxs:text-xxs leading-4 md:text-xs hover:cursor-pointer hover:underline"
                        onClick={() => navigator(`/marketplace/drc20/purchase/${transferInscription.inscriptionId}`)}
                      >
                        {transferInscription.amount.toLocaleString() +
                          ' ' +
                          transferInscription.tick +
                          ' (#' +
                          transferInscription.inscriptionNumber +
                          ')'}
                      </span>
                      {transferInscription.verified === 2 && (
                        <img src={'/images/verifyIcon.png'} alt="Verify Icon" className="h-3 w-3" />
                      )}
                      {transferInscription.verified === 0 && (
                        <img src={'/images/dangerIcon.png'} alt="Danger Icon" className="h-3 w-3" />
                      )}
                    </div>
                  </td>
                  <td className="xxs:pl-4 md:pl-0 pt-4 text-xs text-left">
                    <div className="flex flex-col">
                      {transferInscription.listingPrice > 0 ? (
                        <>
                          <span className="flex items-center gap-1 text-xs">
                            {(transferInscription.listingPrice / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            })}{' '}
                            <img className="h-3 w-3 object-cover" src={'/images/dogecoin.svg'} alt="Drc20 Icon" />
                          </span>
                          <span className="text-xxs text-slate-400">
                            $
                            {(
                              (transferInscription.listingPrice / ONE_DOGE_IN_SHIBES) *
                              dogecoinPriceInUsd
                            ).toLocaleString('en-US', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </>
                      ) : (
                        'No listing data available'
                      )}
                    </div>
                  </td>
                  <td className="pt-4 text-xs text-left">
                    {transferInscription.listingPrice > 0 ? (
                      <button
                        className="bg-red-button text-red-text font-semibold rounded-base w-16 px-3 py-[5px]"
                        onClick={() => showDrc20CancelModal(transferInscription)}
                        title="Unlist"
                      >
                        Unlist
                      </button>
                    ) : transferInscription.unlisted ? (
                      <button
                        className="bg-red-button text-red-text font-semibold rounded-base w-16 px-3 py-[5px]"
                        onClick={() => showDrc20CancelModal(transferInscription)}
                        title="Clear"
                      >
                        Clear
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex mt-8 w-full justify-center">
        <nav className="flex items-center justify-between">
          <div className="flex items-center justify-between gap-2">
            <div>
              <button
                onClick={() => handleTransferInscriptionsPageChange(1)}
                disabled={currentTransferInscriptionsPage === 1}
                className="px-2 py-2 text-base font-medium text-gray-500 border border-r-0 border-gray-300 rounded-l-md cursor-pointer hover:bg-account-page-default"
                style={{ backgroundColor: currentTransferInscriptionsPage === 1 ? '#EFF2F5' : '' }}
              >
                <MdKeyboardDoubleArrowLeft />
              </button>
              <button
                onClick={() => handleTransferInscriptionsPageChange(currentTransferInscriptionsPage - 1)}
                disabled={currentTransferInscriptionsPage === 1}
                className="px-2 py-2 text-base font-medium text-gray-500 border border-gray-300 cursor-pointer hover:bg-account-page-default"
                style={{ backgroundColor: currentTransferInscriptionsPage === 1 ? '#EFF2F5' : '' }}
              >
                <MdKeyboardArrowLeft />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Page {currentTransferInscriptionsPage} of {totalTransferInscriptionsPages}
              </p>
            </div>
            <div>
              <button
                onClick={() => handleTransferInscriptionsPageChange(currentTransferInscriptionsPage + 1)}
                disabled={currentTransferInscriptionsPage === totalTransferInscriptionsPages}
                className="px-2 py-2 text-base font-medium text-gray-500 border border-gray-300 cursor-pointer hover:bg-account-page-default"
                style={{
                  backgroundColor: currentTransferInscriptionsPage === totalTransferInscriptionsPages ? '#EFF2F5' : '',
                }}
              >
                <MdKeyboardArrowRight />
              </button>
              <button
                onClick={() => handleTransferInscriptionsPageChange(totalTransferInscriptionsPages)}
                disabled={currentTransferInscriptionsPage === totalTransferInscriptionsPages}
                className="px-2 py-2 text-base font-medium text-gray-500 border border-l-0 border-gray-300 rounded-r-md cursor-pointer hover:bg-account-page-default"
                style={{
                  backgroundColor: currentTransferInscriptionsPage === totalTransferInscriptionsPages ? '#EFF2F5' : '',
                }}
              >
                <span className="flex">
                  <MdKeyboardDoubleArrowRight />
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

export default RevokeDrc20Overview
