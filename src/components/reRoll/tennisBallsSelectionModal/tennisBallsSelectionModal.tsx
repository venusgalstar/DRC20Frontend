import { Modal } from 'antd'

import { OverviewCard } from '@/components/labradoge'
import { Text } from '@/components/ui'
import { useReRollData } from '@/hooks/useReRollData'

import styles from './tennisBallsSelectionModal.module.scss'

export function TennisBallsSelectionModal() {
  const { isModalOpen, setIsModalOpen, tennisBalls, handleTennisBallSelection } = useReRollData()
  return (
    <Modal
      width={572}
      footer={false}
      open={isModalOpen === 'tennisBalls'}
      onCancel={() => {
        setIsModalOpen(null)
      }}
    >
      <Text className={styles.headline} size="lg" fontWeight="extraBold">
        SELECT YOUR TENNIS BALL TO RE-ROLL
      </Text>
      <div className={styles.selectionContainer}>
        {tennisBalls.map((tennisBall, index) => (
          <OverviewCard
            imageSrc={tennisBall.imageSrc}
            cleanHeadline={`Tennis Ball #${tennisBall.id}`}
            buttonConfig={[{ onClick: () => handleTennisBallSelection(tennisBall), label: 'Select' }]}
          />
        ))}
      </div>
    </Modal>
  )
}
