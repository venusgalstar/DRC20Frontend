import { capitalize } from '@/utils'

import { Text } from '../../ui/text'
import styles from './infoBox.module.scss'

interface InfoBoxProps {
  name: string | undefined
  value: string | undefined
  rarity: number | undefined
}
export function InfoBox({ value, rarity, name }: InfoBoxProps) {
  return (
    <div className={styles.container}>
      <Text fontWeight="normal" size="xs" className={styles.name}>
        {name?.toUpperCase()}
      </Text>
      <div className={styles.textBox}>
        <Text size="xs" fontWeight="bold">
          {capitalize(value || '')}
        </Text>
        <Text className={styles.rarity} size="xs" fontWeight="thin">
          {rarity || 1 * 100}%
        </Text>
      </div>
    </div>
  )
}
