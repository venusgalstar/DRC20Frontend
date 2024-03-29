import { Tooltip } from 'antd'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md'
import { useNavigate } from 'react-router'

import { PendingBalanceDatas } from '@/api'
import { QuestionCircleIcon } from '@/assets/icons/questionCircleIcon'
import { Drc20 } from '@/types/drc20'
import { TransferInscription } from '@/types/transferInscriptions'
import { ONE_DOGE_IN_SHIBES } from '@/utils/constants'

import BlinkingPoint from './PendingBalanceBlinkingPoint'

type PublicDrc20OverviewProps = {
  drc20Array: Drc20[]
  transferInscriptions: TransferInscription[]
  searchValue: string
  itemsPerPage: number
  dogecoinPriceInUsd: number
  pendingD20Balances?: PendingBalanceDatas
}

const PublicDrc20Overview = ({
  drc20Array,
  transferInscriptions,
  searchValue,
  itemsPerPage,
  dogecoinPriceInUsd,
  pendingD20Balances = {},
}: PublicDrc20OverviewProps) => {
  const navigator = useNavigate()
  const selectedColor = '#000' // use the one from tailwind.config.js
  const defaultColor = '#fff' // use the one from tailwind.config.js

  const [isBalanceTabSelected, setIsBalanceTabSelected] = useState<boolean>(true)
  const [balanceButtonBgColor, setBalanceButtonBgColor] = useState<string>(selectedColor)
  const [transferInscriptionButtonBgColor, setTransferInscriptionButtonBgColor] = useState<string>(defaultColor)
  const [balanceButtonTextColor, setBalanceButtonTextColor] = useState<string>('white')
  const [transferInscriptionButtonTextColor, setTransferInscriptionButtonTextColor] = useState<string>('black')

  const [currentDrc20Page, setCurrentDrc20Page] = useState<number>(1)
  const [totalDrc20Pages, setTotalDrc20Pages] = useState<number>(1)
  const [currentDrc20Items, setCurrentDrc20Items] = useState<Drc20[]>()

  const [currentTransferInscriptionsPage, setCurrentTransferInscriptionsPage] = useState<number>(1)
  const [totalTransferInscriptionsPages, setTotalTransferInscriptionsPages] = useState<number>(1)
  const [currentTransferInscriptionsItems, setCurrentTransferInscriptionsItems] = useState<TransferInscription[]>()

  useEffect(() => {
    if (drc20Array) {
      const drc20ArrayInclPending = [...drc20Array]
      Object.keys(pendingD20Balances).forEach((d20Name) => {
        if (!drc20Array.find((d20) => d20.name === d20Name)) {
          // add it to the top
          drc20ArrayInclPending.unshift({
            name: d20Name,
            available: 0,
            transferable: 0,
            verified: 1,
          })
        }
      })

      const currentDrc20Items = drc20ArrayInclPending.slice(
        currentDrc20Page === 1 ? 0 : (currentDrc20Page - 1) * itemsPerPage,
        currentDrc20Page * itemsPerPage
      )

      const totalDrc20Pages =
        drc20ArrayInclPending.length === 0 ? 1 : Math.ceil(drc20ArrayInclPending.length / itemsPerPage)

      setCurrentDrc20Items(currentDrc20Items)
      setTotalDrc20Pages(totalDrc20Pages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drc20Array, currentDrc20Page, pendingD20Balances])

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

  const handleDrc20PageChange = (page: number) => {
    setCurrentDrc20Page(page)
  }

  const handleTransferInscriptionsPageChange = (page: number) => {
    setCurrentTransferInscriptionsPage(page)
  }

  const handleBalanceClick = () => {
    setBalanceButtonBgColor(selectedColor)
    setBalanceButtonTextColor('white')
    setTransferInscriptionButtonBgColor(defaultColor)
    setTransferInscriptionButtonTextColor('black')
    setIsBalanceTabSelected(true)
  }

  const handleTransferInscriptionClick = () => {
    setBalanceButtonBgColor(defaultColor)
    setBalanceButtonTextColor('black')
    setTransferInscriptionButtonBgColor(selectedColor)
    setTransferInscriptionButtonTextColor('white')
    setIsBalanceTabSelected(false)
  }

  return (
    <>
      <div className="flex justify-between w-full border-b-2 border-account-page-default pb-4">
        <div className="flex flex-row bg-account-page-background" style={{border:'1px solid #fff'}}>
          <button
            className="px-8 py-1 xxs:text-xxxs leading-4 xs:text-xs"
            style={{
              backgroundColor: balanceButtonBgColor,
              color: balanceButtonTextColor,
              border: '0px',
              borderRadius: '0px'
            }}
            onClick={handleBalanceClick}
          >
            Balance
          </button>
          <button
            className="px-2 py-1 xxs:text-xxxs leading-4 xs:text-xs"
            style={{
              backgroundColor: transferInscriptionButtonBgColor,
              color: transferInscriptionButtonTextColor,
              border: '0px',
              borderRadius: '0px'
            }}
            onClick={handleTransferInscriptionClick}
          >
            Transfer inscriptions
          </button>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-hidden">
        <table className="max-w-7xl table-fixed min-w-full">
          <thead className="w-full border-solid border-b-2 border-account-page-default">
            {isBalanceTabSelected ? (
              <tr className="w-full">
                <th className="font-normal sticky table-cell-shadow-right min-w-full bg-white z-10 md:static left-0 md:left-auto whitespace-nowrap py-4 text-xs pr-8 md:pr-56 text-left" style={{backgroundColor:'#00000000',color:'#fff'}}>
                  Item
                </th>
                <th className="font-normal whitespace-nowrap xxs:pl-4 md:pl-0 pr-12 py-4 text-left text-xs text-light-dark" style={{backgroundColor:'#00000000',color:'#fff'}}>
                  Available
                </th>
                <th className="font-normal whitespace-nowrap pr-12 py-4 text-left text-xs text-light-dark" style={{backgroundColor:'#00000000',color:'#fff'}}>
                  Transferable
                </th>
                <th className="font-normal whitespace-nowrap pr-2 py-4 text-xs text-left" style={{backgroundColor:'#00000000',color:'#fff'}}>
                  Pending{' '}
                  <Tooltip
                    title={
                      'Transactions with less than 12 block confirmations can still be affected by Reorgs and are not considered finalized.'
                    }
                  >
                    <QuestionCircleIcon />
                  </Tooltip>
                </th>
                <th className="font-normal whitespace-nowrap pr-2 py-4 text-xs text-left">Balance</th>
              </tr>
            ) : (
              <tr className="w-full">
                <th className="font-normal sticky z-10 table-cell-shadow-right bg-white md:static left-0 md:left-auto whitespace-nowrap py-4 pr-8 md:pr-92 text-xs text-start" style={{backgroundColor:'#000', color:'#fff'}}>
                  Item
                </th>
                <th className="font-normal whitespace-nowrap xxs:pl-4 md:pl-0 pr-12 py-4 text-left text-xs">
                  Listing price
                </th>
              </tr>
            )}
          </thead>
          <tbody className="">
            {isBalanceTabSelected
              ? currentDrc20Items &&
                currentDrc20Items
                  .filter((drc20) => drc20.name.includes(searchValue))
                  .map((drc20) => (
                    <tr className="" key={drc20.name}>
                      <td
                        className="sticky table-cell-shadow-right z-10 bg-black md:static left-0 md:left-auto whitespace-nowrap md:pr-0 md:pl-0 pt-4 text-xs flex justify-start items-center hover:cursor-pointer"
                        style={{color:'#fff'}}
                        onClick={() => navigator(`/marketplace/drc20/${drc20.name}`)}
                      >
                        <img
                          className="md:h-7 md:w-7 w-4 h-4 object-cover rounded-full"
                          src={`https://drc-20-icons.s3.eu-central-1.amazonaws.com/${drc20.name.toLowerCase()}.png`}
                          alt="Drc20"
                          onError={(e) => (e.currentTarget.src = '/ticks/noIcon.svg')}
                        />
                        <span className="ml-1 md:ml-2 mr-0.5 font-normal">{drc20.name}</span>
                        {drc20.verified === 2 && <img src={'/ticks/verify.png'} alt="verified" className="h-3 w-3" />}
                        {drc20.verified === 0 && <img src={'/ticks/caution.png'} alt="caution" className="h-3 w-3" />}
                      </td>
                      <td className="xxs:pl-4 md:pl-0 pt-3 text-left text-xs text-light-dark align-middle">
                        {drc20.available.toLocaleString()}
                      </td>
                      <td className="pt-3 text-left text-xs text-light-dark">
                        <div className="flex items-center justify-start">
                          <span>{drc20.transferable}</span>
                        </div>
                      </td>
                      <td className="pt-3 text-left text-xs">
                        {pendingD20Balances[drc20.name] && (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <BlinkingPoint />
                            <span style={{ marginLeft: '5px' }}>
                              {new BigNumber(pendingD20Balances[drc20.name].balance).isGreaterThan(0) ? '+' : ''}
                              {new BigNumber(pendingD20Balances[drc20.name].balance).toNumber().toLocaleString()}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="pt-3 text-left text-xs">
                        {(
                          drc20.available +
                          drc20.transferable +
                          new BigNumber(pendingD20Balances[drc20.name]?.balance || 0).toNumber()
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))
              : currentTransferInscriptionsItems &&
                currentTransferInscriptionsItems
                  .filter(
                    (transferInscription) =>
                      transferInscription.amount.toString().includes(searchValue) ||
                      transferInscription.tick.includes(searchValue) ||
                      transferInscription.inscriptionNumber.toString().includes(searchValue)
                  )
                  .map((transferInscription) => (
                    <tr key={transferInscription.inscriptionNumber}>
                      <td className="sticky table-cell-shadow-right z-10 md:static left-0 bg-white md:left-auto pt-4 text-xs flex justify-start items-center">
                        <div className="inline-flex items-center">
                          <img
                            className="md:h-7 md:w-7 w-4 h-4 object-cover rounded-full"
                            src={`https://drc-20-icons.s3.eu-central-1.amazonaws.com/${transferInscription.tick.toLowerCase()}.png`}
                            alt="Drc20"
                            onError={(e) => (e.currentTarget.src = '/ticks/noIcon.svg')}
                          />
                          <span
                            className="ml-1 md:ml-2 mr-0.5 font-normal xxs:text-xxs leading-4 md:text-xs hover:cursor-pointer hover:underline"
                            onClick={() =>
                              transferInscription.listingPrice > 0 &&
                              navigator(`/marketplace/drc20/purchase/${transferInscription.inscriptionId}`)
                            }
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
                      <td className="xxs:pl-4 md:pl-0 pt-4 text-left">
                        {transferInscription.listingPrice > 0 ? (
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1 text-xs">
                              {(transferInscription.listingPrice / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              })}
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
                          </div>
                        ) : (
                          'Not listed'
                        )}
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>

      <div className="flex mt-8 w-full justify-center">
        <nav className="flex items-center justify-between">
          {isBalanceTabSelected ? (
            <div className="flex items-center justify-between gap-2">
              <div>
                <button
                  onClick={() => handleDrc20PageChange(1)}
                  disabled={currentDrc20Page === 1}
                  className="px-2 py-2 text-base font-medium text-gray-500 border border-r-0 border-gray-300 rounded-l-md cursor-pointer hover:bg-account-page-default"
                  style={{ backgroundColor: currentDrc20Page === 1 ? '#EFF2F5' : '' }}
                >
                  <MdKeyboardDoubleArrowLeft />
                </button>
                <button
                  onClick={() => handleDrc20PageChange(currentDrc20Page - 1)}
                  disabled={currentDrc20Page === 1}
                  className="px-2 py-2 text-base font-medium text-gray-500 border border-gray-300 cursor-pointer hover:bg-account-page-default"
                  style={{ backgroundColor: currentDrc20Page === 1 ? '#EFF2F5' : '' }}
                >
                  <MdKeyboardArrowLeft />
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Page {currentDrc20Page} of {totalDrc20Pages}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleDrc20PageChange(currentDrc20Page + 1)}
                  disabled={currentDrc20Page === totalDrc20Pages}
                  className="px-2 py-2 text-base font-medium text-gray-500 border border-gray-300 cursor-pointer hover:bg-account-page-default"
                  style={{ backgroundColor: currentDrc20Page === totalDrc20Pages ? '#EFF2F5' : '' }}
                >
                  <MdKeyboardArrowRight />
                </button>
                <button
                  onClick={() => handleDrc20PageChange(totalDrc20Pages)}
                  disabled={currentDrc20Page === totalDrc20Pages}
                  className="px-2 py-2 text-base font-medium text-gray-500 border border-l-0 border-gray-300 rounded-r-md cursor-pointer hover:bg-account-page-default"
                  style={{ backgroundColor: currentDrc20Page === totalDrc20Pages ? '#EFF2F5' : '' }}
                >
                  <span className="flex">
                    <MdKeyboardDoubleArrowRight />
                  </span>
                </button>
              </div>
            </div>
          ) : (
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
                    backgroundColor:
                      currentTransferInscriptionsPage === totalTransferInscriptionsPages ? '#EFF2F5' : '',
                  }}
                >
                  <MdKeyboardArrowRight />
                </button>
                <button
                  onClick={() => handleTransferInscriptionsPageChange(totalTransferInscriptionsPages)}
                  disabled={currentTransferInscriptionsPage === totalTransferInscriptionsPages}
                  className="px-2 py-2 text-base font-medium text-gray-500 border border-l-0 border-gray-300 rounded-r-md cursor-pointer hover:bg-account-page-default"
                  style={{
                    backgroundColor:
                      currentTransferInscriptionsPage === totalTransferInscriptionsPages ? '#EFF2F5' : '',
                  }}
                >
                  <span className="flex">
                    <MdKeyboardDoubleArrowRight />
                  </span>
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  )
}

export default PublicDrc20Overview
