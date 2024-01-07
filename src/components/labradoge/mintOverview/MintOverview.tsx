import AmountInput from '@/components/AmountInput'
import ServiceContentContainer from '@/components/ServiceContentContainer'
import { CustomButton, Text } from '@/components/ui'
import { ImageWrapper } from '@/components/ui/imageWrapper'
import { useLabradogeData } from '@/hooks/useLabradogeData'
import { useWalletContext } from '@/WalletContext'

import unleashDoginals from '../../../assets/images/unleash-doginals.png'
import styles from './mintOverview.module.scss'

export function MintOverview() {
  const { connected } = useWalletContext()
  const { selectedMintAmount, setSelectedMintAmount, onMint } = useLabradogeData()

  return (
    <ServiceContentContainer>
      <ImageWrapper src={unleashDoginals} size="big" />
      <Text className={styles.text} size="xl" fontWeight="extraBold">
        {(connected && 'Select number of Unleash Doginals to swap') || 'Connect your wallet to start the transition'}
      </Text>
      <div className={styles.selectionContainer}>
        <div className={styles.infoContainer}>
          <div className={styles.textContainer}>
            {connected && (
              <>
                <Text color="dark-grey" className={styles.unleashText} size="md">
                  Unleash Doginals in wallet:&nbsp;
                </Text>
                <Text className={styles.unleashAmount} size="md" color="dark-grey">
                  2
                </Text>
              </>
            )}
          </div>
          <Text size="sm">
            Get Packs{' '}
            <a rel="noreferrer noopener" target="_blank" href="https://drc-20.org/labradoges">
              here
            </a>
            .
          </Text>
        </div>
        {connected && <AmountInput value={selectedMintAmount} onChange={setSelectedMintAmount} />}
      </div>
      <CustomButton isDisabled={!selectedMintAmount} className={styles.mintButton} onClick={onMint} label="Mint" />
      <Text className={styles.footerText}>
        By clicking “Mint”, you confirm the accuracy of the input data, agree to the{' '}
        <a href="/legal/terms">Terms of Use</a> and acknowledge that you are choosing to mint the NFT with the
        understanding that it may be worth significantly less than the mint price, and may end up being worth nothing at
        all.{' '}
      </Text>
    </ServiceContentContainer>
  )
}
