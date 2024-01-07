import React, { useEffect, useState } from 'react';
import { useFetch } from 'usehooks-ts'

import { AFetchResult } from '@/hooks/useTokenInfo'
import { Listing } from '@/types/listing'
import { truncateAddress } from '@/utils'

import BaseButton from './BaseButton'
import InteractionModal from './InteractionModal'
import PriceTag from './PriceTag'
import styles from './styles/ListingCard.module.css'
import TokenNameWithTrustLevel from './TokenNameWithTrustLevel'

const ListingCard = ({
  tokenName,
  tokenAmount,
  tokenSymbol,
  dogePerToken,
  dogeDollarPrice,
  listedBy,
  discordLink,
}: Listing) => {
  const baseUrl = import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api2.dogeord.io'
  const url = `${baseUrl}/ticks/byName/${tokenSymbol.toLowerCase()}`
  //let { data } = useFetch<AFetchResult>(url)

  const [showModal, setShowModal] = useState(false)
  const [imgSrc, setImgSrc] = useState(
    `https://drc-20-icons.s3.eu-central-1.amazonaws.com/${tokenSymbol.toLowerCase()}.png`
  )
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setImgSrc('/ticks/noicon.png')
      setHasError(true)
    }
  }

  return (
    <div className={styles.box}>
      <div style={{ width: '100%', display: 'flex' }}>
        <div
          style={{
            height: '24px',
            width: '24px',
            borderRadius: '100%',
            alignSelf: 'center',
            marginInlineEnd: '8px',
            backgroundSize: 'cover',
            backgroundImage: `url(${imgSrc})`,
          }}
        >
          <img src={imgSrc} onError={handleError} alt="tokenIcon" style={{ display: 'none' }} />
        </div>
        <a href={`/drc20/${tokenName.toLowerCase()}`} target="_blank" rel="noopener noreferrer">
          <span style={{ fontWeight: 'bold', textAlign: 'left', color: '#000', textDecoration: 'none' }}>
            {tokenName.toLowerCase()}
          </span>
        </a>
        <TokenNameWithTrustLevel tokenName={tokenName} />
      </div>
      <span style={{ width: '100%', fontWeight: 'bold', color: '#feb628', fontSize: '24px', margin: '1rem 0' }}>
        {tokenAmount.toLocaleString()}
      </span>
      <PriceTag>
        <span> PRICE:</span>
        <span style={{ fontWeight: 'initial' }}>
          {dogePerToken.toLocaleString()} DOGE / ${Number((dogePerToken * dogeDollarPrice).toFixed(2)).toLocaleString()}
        </span>
      </PriceTag>
      <PriceTag>
        <span> TOTAL:</span>
        <span style={{ fontWeight: 'initial' }}>
          {(tokenAmount * dogePerToken).toLocaleString()} DOGE / $
          {Number((tokenAmount * dogePerToken * dogeDollarPrice).toFixed(2)).toLocaleString()}
        </span>
      </PriceTag>
      <PriceTag
        style={{
          backgroundColor: '#ff',
        }}
      >
        <span>HOLDER:</span>
        <span style={{ fontWeight: 'initial' }}>{` ${truncateAddress(listedBy)}`}</span>
      </PriceTag>
      <BaseButton
        style={{
          width: '100%',
          marginBlockStart: '1rem',
        }}
        onClick={() => setShowModal(true)}
      >
        Buy
      </BaseButton>
      {showModal && (
        <InteractionModal onClose={() => setShowModal(false)} style={{ maxWidth: '340px' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 'bold' }}>
              <p>You're about to enter our OTC Desk on Discord!</p>
              <p>
                Look for the deal using the Discord handle of the holder. If you can't find your trading partner, don't
                worry, our team is here to assist you.
              </p>
              <p>
                We'll guide you through the transaction, ensuring a smooth and secure trade. Just confirm, and let's get
                started!
              </p>
            </div>
            <BaseButton
              onClick={() => {
                window.open(discordLink, '_blank')

                setTimeout(() => {
                  setShowModal(false)
                }, 3000)
              }}
              style={{ width: '100%', marginBlockStart: '1rem' }}
            >
              Confirm
            </BaseButton>
          </div>
        </InteractionModal>
      )}
    </div>
  )
}

export default ListingCard
