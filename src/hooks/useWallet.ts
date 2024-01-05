import { useEffect, useRef, useState } from 'react'

async function checkDogeLabs(
  handleAccountsChanged?: (accounts: string[]) => void,
  handleNetworkChanged?: (network: string) => void,
  setDogeLabsInstalled?: (value: boolean) => void
) {
  let dogeLabs = (window as any).dogeLabs

  for (let i = 1; i < 10 && !dogeLabs; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 100 * i))
    dogeLabs = (window as any).dogeLabs
  }

  if (dogeLabs) {
    if (setDogeLabsInstalled) {
      setDogeLabsInstalled(true)
    }
  } else if (!dogeLabs) return

  dogeLabs.getAccounts().then((accounts: string[]) => {
    if (handleAccountsChanged) {
      handleAccountsChanged(accounts)
    }
  })

  if (handleAccountsChanged) {
    dogeLabs.on('accountsChanged', handleAccountsChanged)
  }

  if (handleNetworkChanged) {
    dogeLabs.on('networkChanged', handleNetworkChanged)
  }

  return () => {
    if (handleAccountsChanged) {
      dogeLabs.removeListener('accountsChanged', handleAccountsChanged)
    }

    if (handleNetworkChanged) {
      dogeLabs.removeListener('networkChanged', handleNetworkChanged)
    }
  }
}

export function useWallet() {
  const [dogeLabsInstalled, setDogeLabsInstalled] = useState(false)
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [accounts, setAccounts] = useState<string[]>([])
  const [publicKey, setPublicKey] = useState('')
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  })
  const [network, setNetwork] = useState('livenet')

  const getWalletInfo = async () => {
    const dogeLabs = (window as any).dogeLabs
    const [address] = await dogeLabs.getAccounts()
    setAddress(address)

    const publicKey = await dogeLabs.getPublicKey()
    setPublicKey(publicKey)

    const balance = await dogeLabs.getBalance()
    setBalance(balance)

    const network = await dogeLabs.getNetwork()
    setNetwork(network)
  }

  const selfRef = useRef<{ accounts: string[] }>({
    accounts: [],
  })
  const self = selfRef.current

  const handleAccountsChanged = (_accounts: string[]) => {
    if (self.accounts[0] === _accounts[0]) {
      // prevent from triggering twice
      return
    }
    self.accounts = _accounts
    if (_accounts.length > 0) {
      setAccounts(_accounts)
      setConnected(true)
      setAddress(_accounts[0])
      setPublicKey(_accounts[0])
      getWalletInfo()
    } else {
      setConnected(false)
      getWalletInfo()
    }
  }

  const handleNetworkChanged = (network: string) => {
    setNetwork(network)
    // Call getBasicInfo() here if needed
  }

  const connectWallet = async () => {
    const result = await (window as any).dogeLabs.requestAccounts()
    handleAccountsChanged(result)
  }

  const switchNetwork = async () => {
    const result = await (window as any).dogeLabs.switchNetwork('livenet')
    handleNetworkChanged(result)
  }

  // amount is in satoshis (the smallest unit of DOGE)
  const sendDoge = async (to: string, amount: number): Promise<string> => {
    return await (window as any).dogeLabs.sendBitcoin(to, amount)
  }

  const sendInscription = async (to: string, inscriptionId: string): Promise<string> => {
    console.log('to', to)
    console.log('inscriptionId', inscriptionId)
    // fee rate is used to send inscription relatively fast....
    return await (window as any).dogeLabs.sendInscription(to, inscriptionId, { feeRate: 250000 })
  }

  useEffect(() => {
    checkDogeLabs(handleAccountsChanged, handleNetworkChanged, setDogeLabsInstalled).then()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    dogeLabsInstalled,
    connected,
    address,
    accounts,
    publicKey,
    balance,
    network,
    connectWallet,
    switchNetwork,
    sendDoge,
    sendInscription,
  }
}
