import { Modal } from 'antd'

import { InfoBox } from '@/components/labradoge/infoBox'
import { ImageWrapper } from '@/components/ui/imageWrapper'
import { Labradoge } from '@/types/labradoge'

import { Text } from '../../ui/text'
import styles from './detailModal.module.scss'

export interface DetailModalProps {
  selectedLabradoge?: Labradoge | null
  isModalOpen: boolean
  onCloseDetailModal: () => void
}
export function DetailModal({ isModalOpen, onCloseDetailModal, selectedLabradoge }: DetailModalProps) {
  return (
    <Modal width={572} footer={false} open={isModalOpen} onCancel={onCloseDetailModal}>
      <Text className={styles.detailName} size="lg" fontWeight="extraBold">
        Labradoge #{selectedLabradoge?.inscriptionId}
      </Text>
      <div className={styles.container}>
        <ImageWrapper
          className={styles.imageWrapper}
          src={selectedLabradoge?.image ?? ''}
          size="modal"
          rarity={selectedLabradoge?.rarity}
          tooltipText="Rarity of the Labradoge"
        />
        <div className={styles.attributesBox}>
          { // @ts-ignore
          selectedLabradoge?.attributes?.map((attribute, index) => (
            <InfoBox
              key={`${attribute.label} ${index}`}
              name={attribute.label}
              value={attribute.value}
              rarity={attribute.probability}
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}
