import { Modal } from 'antd'

import { OverviewCard } from '@/components/labradoge'
import { Text } from '@/components/ui'
import { useReRollData } from '@/hooks/useReRollData'

import styles from './labradogeSelectionModal.module.scss'

export function LabradogeSelectionModal() {
  const { isModalOpen, setIsModalOpen, labradoges, handleLabradogeSelection } = useReRollData()
  return (
    <Modal
      width={572}
      footer={false}
      open={isModalOpen === 'labradoge'}
      onCancel={() => {
        setIsModalOpen(null)
      }}
    >
      <Text className={styles.headline} size="lg" fontWeight="extraBold">
        SELECT YOUR LABRADOGE TO RE-ROLL
      </Text>
      <div className={styles.selectionContainer}>
        {labradoges.map((labradoge, index) => (
          <OverviewCard
            imageSrc={labradoge.image}
            labradogeId={labradoge.id}
            inscriptionId={labradoge.inscriptionId}
            buttonConfig={[{ onClick: () => handleLabradogeSelection(labradoge), label: 'Select' }]}
          />
        ))}
      </div>
    </Modal>
  )
}
