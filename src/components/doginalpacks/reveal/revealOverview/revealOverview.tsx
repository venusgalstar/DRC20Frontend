import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'

import { getDoginalInfo } from '@/api'
import AmountInput from '@/components/AmountInput'
import { revealCollectionNames } from '@/components/doginalpacks/collection'
import ServiceContentContainer from '@/components/ServiceContentContainer'
import { CustomButton, Text } from '@/components/ui'
import { ImageWrapper } from '@/components/ui/imageWrapper'
import { transformToLabradoge } from '@/hooks/useGetLabradogesData'
import { useRevealData } from '@/hooks/useRevealData'
import { useWallet } from '@/hooks/useWallet'
import { Labradoge } from '@/types/labradoge'

import styles from './revealOverview.module.scss'

export function RevealOverview() {
  const { pathname } = useLocation()
  const inscriptionId = pathname.split('/')[3]

  const {
    availableLabradogeAmount,
    selectedLabradogeRevealAmount,
    setSelectedLabradogeRevealAmount,
    setCollections,
    labradoges,
    selectedLabradoge,
    onReveal,
    handleLabradogeSelection,
  } = useRevealData()

  const { connected } = useWallet()

  useEffect(() => {
    setCollections(revealCollectionNames)

    getDoginalInfo(inscriptionId).then((res) => {
      const doginal: Labradoge = transformToLabradoge(res)
      handleLabradogeSelection(doginal)
    })
  }, [inscriptionId, handleLabradogeSelection, setCollections])

  return (
    <>
      <ServiceContentContainer>
        <ImageWrapper className="mb-6" src={selectedLabradoge ? selectedLabradoge.image : undefined} size="big" />
        <Text className={`${styles.text} mb-2`} size="xl" fontWeight="extraBold">
          {(connected && `Select number of ${selectedLabradoge?.collectionSymbol} to swap`) ||
            'Connect your wallet to start the transition'}
        </Text>
        <div className={`${styles.selectionContainer} mb-2`}>
          <div className={`${styles.infoContainer} mb-2`}>
            <div className={`${styles.textContainer} mb-2`}>
              <Text color="dark-grey" className={styles.reRollText} size="md">
                Total num of {selectedLabradoge?.collectionSymbol} collection Doginals in wallet:{' '}
                <span className={`${styles.reRollAmount}`}>{availableLabradogeAmount}</span>
              </Text>
            </div>
            <Text size="sm">
              Get packs{' '}
              <a rel="noreferrer noopener" target="_blank" href="https://drc-20.org/labradoges">
                here
              </a>
              .
            </Text>
          </div>
          {connected && (
            <AmountInput
              max={availableLabradogeAmount}
              value={selectedLabradogeRevealAmount}
              onChange={setSelectedLabradogeRevealAmount}
            />
          )}
        </div>
        <CustomButton
          isDisabled={!selectedLabradoge || !labradoges}
          className={styles.button}
          onClick={onReveal}
          label="Reveal"
        />
        <div className={`${styles.textContainer} mt-2`}>
          <Text size="md" className={styles.disclaimer}>
            By clicking “Reveal”, you agree to burn {selectedLabradogeRevealAmount}{' '}
            <strong>{selectedLabradoge?.collectionSymbol}</strong> {selectedLabradogeRevealAmount <= 1 ? 'NFT' : 'NFTs'}{' '}
            and agree to the <a href="/legal/terms">Terms of Use</a>.
          </Text>
        </div>
      </ServiceContentContainer>
    </>
  )
}
