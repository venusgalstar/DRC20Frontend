import { CheckCircleOutlined } from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { useState } from 'react'

import { truncateAddress } from '@/utils/truncateAddress'
import { useWalletContext } from '@/WalletContext'

import CopyButton from '../CopyButton'

type AccountInfoProps = {
  address: string
}

const AccountInfo = ({ address }: AccountInfoProps) => {
  const [profileImage] = useState<string>('/images/unleash-doginals.svg') // change this to proper default value
  const [copied, setCopied] = useState(false)
  const { connected } = useWalletContext()

  const handleShareButtonClick = () => {
    copy(`${window.location.href}/${address}`)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="bg-account-info-background md:my-16 my-8 md:p-12 p-4 rounded-base border-2 border-account-page-default">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="rounded-full mr-2">
            <img className="w-14 h-14 md:w-28 md:h-28 object-cover" src={profileImage} alt="profile" />
          </div>
          <div className="flex flex-col items-left justify-center ml-2">
            <div className="xxs:text-sm xs:text-2xl md:text-3xl text-account-info-font font-extrabold text-start">
              My Account
            </div>
            {connected && (
              <>
                <div className="flex items-center gap-2">
                  <div className="xxs:text-xxxs xs:text-xs text-account-info-font text-left">
                    {truncateAddress(address)}
                  </div>
                  {address ? <CopyButton text={address} /> : <></>}
                </div>
                {/* {isWhitelistUser ? (
                  <div className="flex flex-row my-2">
                    <span className="bg-green-200 px-2 rounded-lg text-green-800 font-bold">Full access</span>
                  </div>
                ) : (
                  <div className="flex flex-row my-2">
                    <span className="bg-red-200 px-2 rounded-lg text-red-800 font-bold">Limited access</span>
                  </div>
                )} */}
              </>
            )}
          </div>
        </div>
        <button onClick={handleShareButtonClick} title="Share your profile" disabled={address ? false : true}>
          {copied ? (
            <CheckCircleOutlined className="text-green-400 xxs:text-xs xs:text-lg" />
          ) : (
            <img src="images/share.svg" alt="share" className="xxs:w-4 xs:w-6" />
          )}
        </button>
      </div>
    </div>
  )
}

export default AccountInfo
