import { Button } from 'antd'
import { BiWallet } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

import { useWalletContext } from '@/WalletContext'

interface WalletConnectInputProps {
  disabled?: boolean
  accountPage?: string
  bgColor?: string
  bgColorLoggedIn?: string
  hightlightColor?: string
  textColor?: string
  hideDoggy?: boolean
}

const WalletConnect: React.FC<WalletConnectInputProps> = ({
  disabled,
  accountPage = '/account',
  bgColor = '#feb628',
  bgColorLoggedIn = 'transparent',
  hightlightColor = '#feb628',
  textColor = '#000000',
  hideDoggy = false,
}) => {
  const navigator = useNavigate()
  const { dogeLabsInstalled, connected, balance, network, connectWallet, switchNetwork } = useWalletContext()

  const navigateToAccountPage = () => {
    navigator(accountPage)
  }
  return (
    <div>
      {(() => {
        if (!dogeLabsInstalled) {
          return (
            <Button
              style={{
                background: bgColor,
                border: 'none',
                borderRadius: '16px',
                color: '#fff',
                fontWeight: 'bold',
                height: '40px',
                padding: '0 12px',
                justifyContent: 'flex-start',
              }}
              onClick={() => {
                window.open(
                  'https://chrome.google.com/webstore/detail/doge-labs-wallet/jiepnaheligkibgcjgjepjfppgbcghmp',
                  '_blank'
                )
              }}
              className={`install-button ${!dogeLabsInstalled ? 'visible' : 'hidden'}`}
            >
              Install DogeLabs Wallet
            </Button>
          )
        } else if (!connected) {
          return (
            <Button
              disabled={disabled}
              className={disabled ? 'opacity-30' : ''}
              style={{
                background: disabled ? '#ccc' : bgColor,
                border: 'none',
                borderRadius: '16px',
                color: '#fff',
                fontWeight: 'bold',
                height: '40px',
                padding: '0 12px',
                justifyContent: 'flex-start',
              }}
              onClick={async () => {
                await connectWallet()
              }}
            >
              Connect Wallet
            </Button>
          )
        } else if (network !== 'livenet') {
          return (
            <div>
              <button
                className="py-1 px-3 bg-amber-500 text-white rounded-lg"
                style={{ backgroundColor: bgColor, color: hightlightColor }}
                onClick={async () => {
                  await switchNetwork()
                }}
              >
                Switch Network
              </button>
            </div>
          )
        } else {
          return (
            <div
              className="flex items-center justify-between px-2 md:px-2 py-0 md:gap-x-0 gap-x-1 border-2 border-account-page-default xxs:text-xxs md:text-xs leading-4 rounded-base cursor-pointer"
              onClick={navigateToAccountPage}
              style={{ backgroundColor: bgColorLoggedIn }}
            >
              <div className="text-amber-500 text-lg" style={{ color: hightlightColor }}>
                <BiWallet />
              </div>
              <div className={!hideDoggy ? 'border-r-2' : ''}>
                <div className="md:px-1 whitespace-nowrap px-1 py-1.5 md:py-2" style={{ color: textColor }}>
                  {(balance.confirmed / 100000000).toFixed(2)} DOGE
                </div>
              </div>
              {!hideDoggy && (
                <img src="/images/doggy.png" alt="Profile" className="w-5 h-5 md:mr-4 mr-0 md:ml-1 ml-0" />
              )}
            </div>
          )
        }
      })()}
    </div>
  )
}

export default WalletConnect
