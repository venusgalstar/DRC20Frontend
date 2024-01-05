import { useLocation, useNavigate } from 'react-router-dom'

import { OverviewCard } from '@/components/labradoge'
import { DetailModal } from '@/components/labradoge/detailModal/detailModal'
import { useLabradogeData } from '@/hooks/useLabradogeData'

import styles from './mintedOverview.module.scss'

export function MintedOverview() {
  const { mintedLabradoges, onOpenDetailModal, isModalOpen, selectedLabradoge, onCloseDetailModal } = useLabradogeData()
  const navigator = useNavigate()
  const { pathname } = useLocation()

  return (
    <>
      <div className={styles.grid}>
        {/* @ts-ignore */
        mintedLabradoges.map((mintedLabradoge, index) => (
          <OverviewCard
            key={`${mintedLabradoge.id} ${index}`}
            imageSrc={mintedLabradoge.image}
            labradogeId={mintedLabradoge.id}
            inscriptionId={mintedLabradoge.inscriptionId}
            buttonConfig={[
              {
                label: 'Re-Roll',
                onClick: () =>
                  pathname === '/service/re-roll' ? window.location.reload() : navigator('/service/re-roll'),
              },
            ]}
            onHoverButtonClick={() => onOpenDetailModal(mintedLabradoge)}
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
