import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useFetch } from 'usehooks-ts'

import InputField from './InputField'
import SelectField from './SelectField'

type SliderMintOrTransferProps = {
  actionType: 'Mint' | 'Transfer'
  setTick: (tick: string) => void
  tick: string
  amount: number | null
  setAmount: (amount: number) => void
  recipientAddress: string
  setRecipientAddress: (recipientAddress: string) => void
}

const SliderMintOrTransfer = ({
  actionType,
  setTick,
  tick,
  amount,
  setAmount,
  recipientAddress,
  setRecipientAddress,
}: SliderMintOrTransferProps) => {
  const urlTickList = `${
    import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api2.dogeord.io'
  }/ticks/list/recentlyAdded?size=100000&page=0`

  const { data: dataTicks } = useFetch<any>(urlTickList)

  // when minting we check the amount left when transfering not
  const options = useMemo(() => {
    if (!dataTicks) return []
    if (actionType === 'Mint') {
      return dataTicks?.data
        .filter((tick: any) => tick.minted < tick.supply)
        .map((tick: any) => ({ value: tick.tick, label: tick.tick }))
    }
    if (actionType === 'Transfer') {
      return dataTicks?.data.map((tick: any) => ({
        value: tick.tick,
        label: tick.tick,
      }))
    }
  }, [actionType, dataTicks])

  return (
    <>
      <SelectField
        label="drc-20"
        description={
          <div style={{ maxWidth: '300px' }}>{`Insert the tick of the drc-20 tokens you want to ${
            actionType === 'Mint' ? 'mint' : 'transfer'
          }. You can find the tick for example in the explorer.`}</div>
        }
        placeholder="tick"
        defaultValue={tick.length > 0 ? tick : undefined}
        options={options}
        onChange={(value: any) => {
          setTick(value)
        }}
      />
      <InputField
        label="Amount"
        description={
          <div style={{ maxWidth: '300px' }}>{`Specify the amount of drc-20 tokens you want to ${
            actionType === 'Mint' ? 'mint' : 'transfer'
          }.`}</div>
        }
        placeholder="0.0"
        value={amount}
        onChange={(evt) => {
          setAmount(evt.target.value)
        }}
        inputStyle={{ marginLeft: '-10px' }}
      />
      <InputField
        label="Wallet address"
        description={
          <div style={{ maxWidth: '300px' }}>
            We recommend to use the Doge Labs Wallet. Install it{' '}
            <a href={'https://chrome.google.com/webstore/detail/doge-labs-wallet/jiepnaheligkibgcjgjepjfppgbcghmp'}>
              here:
            </a>
            <br /> In case you do not have a wallet address yet, you can create it with it.
          </div>
        }
        placeholder="Recipient wallet address"
        value={recipientAddress}
        onChange={(e: any) => {
          setRecipientAddress(e.target.value)
        }}
        inputStyle={{ marginLeft: '-10px' }}
      />
    </>
  )
}

export default SliderMintOrTransfer
