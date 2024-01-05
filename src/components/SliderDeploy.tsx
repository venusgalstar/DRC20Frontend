import { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'

import InputField from './InputField'

type SliderDeployProps = {
  tick: string
  setTick: (tick: string) => void
  totalSupply: number | null
  setTotalSupply: (totalSupply: number | null) => void
  limitPerMint: number | null
  setLimitPerMint: (limitPerMint: number | null) => void
  recipientAddress: string
  setRecipientAddress: (recipientAddress: string) => void
  setError: (error: string) => void
}
const SliderDeploy = ({
  tick,
  setTick,
  totalSupply,
  setTotalSupply,
  limitPerMint,
  setLimitPerMint,
  recipientAddress,
  setRecipientAddress,
  setError,
}: SliderDeployProps) => {
  useEffect(() => {
    if (totalSupply && limitPerMint) {
      if (Number(totalSupply) < Number(limitPerMint)) {
        setError('Total supply must be bigger than limit per mint.')
      } else {
        setError('')
      }
    }
  }, [totalSupply, limitPerMint, setError])

  return (
    <>
      <InputField
        label="drc-20"
        description={
          <div style={{ maxWidth: '300px' }}>
            Insert the tick of the drc-20 tokens you want to deploy. You can find the tick for example in the explorer.
          </div>
        }
        placeholder="tick"
        value={tick}
        onChange={(e: any) => {
          setTick(e.target.value)
        }}
        wrapperStyle={{ height: '84px', margin: '24px 0' }}
        inputStyle={{ marginLeft: '-10px', marginTop: '7px' }}
      />
      <InputField
        label="Total supply"
        description={<div style={{ maxWidth: '300px' }}>Specify the total supply</div>}
        placeholder="0.0"
        value={totalSupply}
        onChange={(e: any) => {
          setTotalSupply(e.target.value)
        }}
      />
      <InputField
        label="Limit per mint"
        description={
          <div style={{ maxWidth: '300px' }}>Specify the maximum amount that can be minted in one inscription</div>
        }
        placeholder="0.0"
        value={limitPerMint}
        onChange={(e: any) => {
          setLimitPerMint(e.target.value)
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

export default SliderDeploy
