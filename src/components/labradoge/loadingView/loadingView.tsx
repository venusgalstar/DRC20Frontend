import styles from './loadingView.module.scss'
import tennisBall from './tennisBall.svg'

export function LoadingView({ isFixed = false }) {
  const containerClass = `${styles.animationContainer} ${isFixed ? styles.fixedPosition : ''}`

  return (
    <div className={containerClass}>
      <img alt="Tennis Ball" src={tennisBall} className={styles.tennisBall} />
      <img alt="Tennis Ball" src={tennisBall} className={styles.tennisBall} />
      <img alt="Tennis Ball" src={tennisBall} className={styles.tennisBall} />
    </div>
  )
}
