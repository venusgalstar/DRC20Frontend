//import React from 'react'

import AmountInput from '@/components/AmountInput'
import ServiceContentContainer from '@/components/ServiceContentContainer'
import { CustomButton, Text } from '@/components/ui'
import { ImageWrapper } from '@/components/ui/imageWrapper'
import { useTennisBallData } from '@/hooks/useTennisBallData'

import tennisBallMintBackground from '../../../assets/images/tennisBallMint.svg'
import styles from './tennisBallMintOverview.module.scss'

export function TennisBallMintOverview() {
  const { onMint, setMintAmount, mintAmount, fiwbBalance, mintPrice, isMintButtonDisabled } = useTennisBallData()
  return (
    <ServiceContentContainer>
      <div className={styles.container}>
        <ImageWrapper
          size="big"
          imgPlaceholder={
            <div className={styles.imageBackground}>
              <img src={tennisBallMintBackground} alt="Tennis Ball Mint Background" />
            </div>
          }
        />
        <Text className={styles.headline} size="xl" fontWeight="extraBold">
          Select number of Tennis Ball NFTs to purchase
        </Text>
        <div className={styles.infoContainer}>
          <div className={styles.textContainer}>
            <Text color="dark-grey" className={styles.fiwbText} size="md">
              FIWB in wallet:&nbsp;
            </Text>
            <Text className={styles.fiwbAmount} size="md" color="dark-grey">
              {fiwbBalance}
            </Text>
          </div>
          <Text size="sm">
            Get FIWB <a href="https://drcfront.web.app/marketplace/drc20/fiwb">here</a>.
          </Text>
        </div>
        <div className={styles.mintAmountContainer}>
          <div className={styles.mintContainerText}>
            <Text className={styles.price} fontWeight="normal" size="sm" color="dark-grey">
              Price
            </Text>
            <Text size="xl" fontWeight="extraBold" className={styles.mintPrice}>
              {mintPrice} FIWB
            </Text>
            <Text className={styles.price} fontWeight="normal" size="sm" color="dark-grey">
              ~0.94$
            </Text>
          </div>
          <AmountInput className={styles.amount} value={mintAmount} onChange={setMintAmount} />
        </div>
        <CustomButton isDisabled={isMintButtonDisabled} className={styles.mintButton} onClick={onMint} label="Mint" />
        <Text className={styles.footerText}>
          By clicking “Mint”, you confirm the accuracy of the input data, agree to the{' '}
          <a href="/legal/terms">Terms of Use</a> and acknowledge that you are choosing to mint the NFT with the
          understanding that it may be worth significantly less than the mint price, and may end up being worth nothing
          at all.{' '}
        </Text>
      </div>
    </ServiceContentContainer>
  )
}
