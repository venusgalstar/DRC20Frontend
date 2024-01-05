import { OverviewCard } from '@/components/labradoge'
import styles from '@/components/labradoge/mintedOverview/mintedOverview.module.scss'
import { useTennisBallData } from '@/hooks/useTennisBallData'

export function TennisBallMintedOverview() {
  const { mintedTennisBalls } = useTennisBallData()
  return (
    <div className={styles.grid}>
      {//@ts-ignore
        mintedTennisBalls?.map((mintedTennisBall, index) => (
        <OverviewCard
          key={`${mintedTennisBall.id} ${index}`}
          imageSrc={mintedTennisBall.imageSrc}
          cleanHeadline={`Tennis Ball #${mintedTennisBall.id}`}
        />
      ))}
    </div>
  )
}
