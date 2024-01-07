import { useLocation, useNavigate } from 'react-router-dom'

import { OverviewCard } from '@/components/labradoge'
import { DetailModal } from '@/components/labradoge/detailModal/detailModal'
import { useRevealData } from '@/hooks/useRevealData'

import styles from './revealedOverview.module.scss'

export function RevealedOverview() {
  const { onCloseDetailModal, onOpenDetailModal, isModalOpen, selectedLabradoge, revealedLabradoges } = useRevealData()
  const navigator = useNavigate()
  const { pathname } = useLocation()

  return (
    <>
      <div className={styles.grid}>
        {/* @ts-ignore */
        revealedLabradoges?.map((revealedLabradoge, index) => (
          <OverviewCard
            key={`${revealedLabradoge.id} ${index}`}
            imageSrc={revealedLabradoge.image}
            labradogeId={revealedLabradoge.id}
            inscriptionId={revealedLabradoge.inscriptionId}
            buttonConfig={[
              {
                label: 'Re-Roll',
                onClick: () =>
                  pathname === '/service/re-roll' ? window.location.reload() : navigator('/service/re-roll'),
              },
            ]}
            onHoverButtonClick={() => onOpenDetailModal(revealedLabradoge)}
          />
        ))}
      </div>
      <DetailModal
        isModalOpen={isModalOpen}
        onCloseDetailModal={onCloseDetailModal}
        selectedLabradoge={selectedLabradoge}
      />
    </>
  )
}
