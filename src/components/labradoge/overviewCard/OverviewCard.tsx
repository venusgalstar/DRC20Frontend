import { CustomButton, Text } from '@/components/ui'
import { ImageWrapper } from '@/components/ui/imageWrapper'

import styles from './overviewCard.module.scss'

export interface OverviewCardProps {
  imageSrc: string
  isBig?: boolean
  labradogeId?: number
  cleanHeadline?: string
  subHeadline?: string
  inscriptionId?: number
  buttonConfig?: { onClick: () => void; label: string; isDisabled?: boolean }[]
  onHoverButtonClick?: () => void
  onHoverButtonLabel?: { label: string; disabled: boolean }
}
export function OverviewCard({
  buttonConfig,
  cleanHeadline,
  imageSrc,
  isBig = false,
  subHeadline,
  inscriptionId,
  labradogeId,
  onHoverButtonClick,
  onHoverButtonLabel = { label: 'Details', disabled: false },
}: OverviewCardProps) {
  return (
    <div className={`${styles.container} ${isBig ? styles.isBig : ''}`}>
      <ImageWrapper
        src={imageSrc}
        size={isBig ? 'big' : 'normal'}
        hoverButton={
          onHoverButtonClick
            ? { onClick: onHoverButtonClick, label: onHoverButtonLabel.label, disabled: onHoverButtonLabel?.disabled }
            : undefined
        }
      />
      <div className={`${styles.infoContainer} max-w-[${isBig ? '350px' : '180px'}]`}>
        {labradogeId || cleanHeadline ? (
          <Text size={isBig ? 'xl' : 'sm'} fontWeight={isBig ? 'extraBold' : 'bold'}>
            {labradogeId ? `Labradoge #${labradogeId}` : cleanHeadline}
          </Text>
        ) : null}
        {subHeadline ? (
          <Text
            className={`break-all ${isBig ? styles.inscriptionText : ''}`}
            color={isBig ? 'dark-grey' : 'black'}
            size={isBig ? 'lg' : 'xs'}
            fontWeight="normal"
          >
            <p className="font-light">{subHeadline}</p>
          </Text>
        ) : null}
        {inscriptionId ? (
          <Text
            className={`break-all ${isBig ? styles.inscriptionText : ''}`}
            color={isBig ? 'dark-grey' : 'black'}
            size={isBig ? 'lg' : 'xs'}
            fontWeight="normal"
          >
            <p className="font-light">#{inscriptionId}</p>
          </Text>
        ) : null}
      </div>
      {!!buttonConfig?.length ? (
        <div className={styles.buttonContainer}>
          {buttonConfig.map((button, index) => (
            <CustomButton
              isDisabled={button.isDisabled || false}
              onClick={button.onClick}
              label={button.label}
              key={`${button.label} ${index}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
