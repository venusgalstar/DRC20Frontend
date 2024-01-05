import * as bitcoin from 'bitcoinjs-lib'

import { generateAccessToken, getRandomMessage } from '@/api'

import { DOGECOIN_NETWORK } from './constants'

export const getDummyUtxoValueFromSellerPsdt = (sellerPsdtHex: string) => {
  const sellerPsdt = bitcoin.Psbt.fromHex(sellerPsdtHex, {
    network: DOGECOIN_NETWORK,
  })
  const txIndex = sellerPsdt.txInputs[2].index
  const dummyValue = bitcoin.Transaction.fromBuffer(sellerPsdt.data.inputs[2].nonWitnessUtxo!).outs[txIndex].value

  return dummyValue
}

export const generateJwt = async (address: string) => {
  const dogeLabs = (window as any).dogeLabs
  const pubkey = await dogeLabs.getPublicKey()

  const { res: randomMessageRes, err: randomMessageErr } = await getRandomMessage(address)

  if (randomMessageErr) {
    throw new Error('unable to generate random message')
  }

  const signature = await dogeLabs.signMessage(randomMessageRes!.data.randomMessage)
  const { res: genAccessTokenRes, err: genAccessTokenErr } = await generateAccessToken(
    address,
    randomMessageRes!.data.randomMessage,
    pubkey,
    signature
  )

  if (genAccessTokenErr) {
    throw new Error('unable to generate access token')
  }

  if (!(window as any).dogeLabsJwt) {
    ;(window as any).dogeLabsJwt = {}
  }

  ;(window as any).dogeLabsJwt = { ...(window as any).dogeLabsJwt, [address]: genAccessTokenRes!.data.accessToken }
}
