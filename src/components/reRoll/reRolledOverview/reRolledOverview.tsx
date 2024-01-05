import { useLocation, useNavigate } from 'react-router-dom'

import { OverviewCard } from '@/components/labradoge'
import { DetailModal } from '@/components/labradoge/detailModal/detailModal'
import { CustomButton, Heading, Text } from '@/components/ui'
import { useReRollData } from '@/hooks/useReRollData'

import styles from './reRolledOverview.module.scss'

export function ReRolledOverview() {
  const { isModalOpen, setIsModalOpen, reRolledLabradoge, isKeepingLabradoge, setIsKeepingLabradoge } = useReRollData()
  const navigator = useNavigate()
  const { pathname } = useLocation()

  return (
    <>
      <div className={styles.container}>
        {!isKeepingLabradoge ? (
          <Heading className={styles.headline} color="black">
            Congratulations on your new Labradoges!
          </Heading>
        ) : null}
        {reRolledLabradoge ? (
          <OverviewCard
            isBig
            imageSrc={reRolledLabradoge.image}
            labradogeId={reRolledLabradoge.id}
            inscriptionId={reRolledLabradoge.inscriptionId}
            buttonConfig={
              !isKeepingLabradoge
                ? [
                    {
                      label: 'Keep it',
                      onClick: () => setIsKeepingLabradoge(true),
                    },
                    {
                      label: 'Re-Roll',
                      onClick: () =>
                        pathname === '/service/re-roll' ? window.location.reload() : navigator('/service/re-roll'),
                    },
                  ]
                : undefined
            }
            onHoverButtonClick={() => {
              setIsModalOpen('detail')
            }}
          />
        ) : null}
        {isKeepingLabradoge ? (
          <>
            <Text size="xl" fontWeight="extraBold">
              Throw some more Tennis Balls and try to fetch some rare Labradoges.
            </Text>
            <CustomButton
              onClick={() => {
                pathname === '/service/re-roll' ? window.location.reload() : navigator('/service/re-roll')
              }}
              label="Re-Roll"
            />
          </>
        ) : null}
      </div>
      <DetailModal
        isModalOpen={isModalOpen === 'detail'}
        onCloseDetailModal={() => {
          setIsModalOpen(null)
        }}
        selectedLabradoge={reRolledLabradoge}
      />
    </>
  )
}
