import { Tooltip } from 'antd'
import { ReactNode } from 'react'

import { CustomButton, Text } from '@/components/ui'

import styles from './imageWrapper.module.scss'

interface ImageWrapperProps {
  src?: string
  imgPlaceholder?: ReactNode
  alt?: string
  className?: string
  size?: 'normal' | 'modal' | 'big' | 'small'
  rarity?: number
  hoverButton?: {
    onClick: () => void
    label: string
    disabled?: boolean
  }
  onClickImage?: () => void
  tooltipText?: string
}
export function ImageWrapper({
  alt = '',
  src,
  className,
  size = 'normal',
  rarity,
  hoverButton,
  onClickImage,
  imgPlaceholder,
  tooltipText = '',
}: ImageWrapperProps) {
  return (
    <div className={styles.container}>
      {imgPlaceholder ? (
        imgPlaceholder
      ) : (
        <div className={styles.imageWrapper}>
          <img
            onClick={onClickImage}
            className={`${styles.image} ${styles[size]} ${className} ${!!onClickImage ? styles.pointer : ''} ${
              hoverButton ? styles.imageAnimation : ''
            }`}
            src={src}
            alt={alt ?? src}
          />
        </div>
      )}
      {rarity ? (
        <Tooltip title={tooltipText}>
          <div className={styles.rarityContainer}>
            <Text size="sm" fontWeight="bold">
              {rarity}
            </Text>
          </div>
        </Tooltip>
      ) : null}
      {hoverButton && hoverButton.disabled === false ? (
        <div className={styles.hoverButton}>
          <CustomButton className={`${styles.customButton}`} onClick={hoverButton.onClick} label={hoverButton.label} />
        </div>
      ) : null}
    </div>
  )
}
