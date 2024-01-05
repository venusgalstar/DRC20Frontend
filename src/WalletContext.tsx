import React, { createContext, useContext } from 'react'

import { useWallet } from '@/hooks/useWallet' // Import your useWallet hook

interface WalletContextType {
  dogeLabsInstalled: boolean
  connected: boolean
  address: string
  accounts: string[]
  balance: {
    confirmed: number
    unconfirmed: number
    total: number
  }
  network: string
  connectWallet: () => Promise<void>
  switchNetwork: () => Promise<void>
  sendDoge: (address: string, amount: number) => Promise<string>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)
// @ts-ignore
const WalletProvider: React.FC = ({ children }) => {
  const wallet = useWallet()

  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
}

const useWalletContext = (): WalletContextType => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('WalletContext must be used within a WalletProvider')
  }
  return context
}

export { useWalletContext, WalletProvider }
