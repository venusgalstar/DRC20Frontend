import { CSSProperties, ReactNode } from 'react'

import { TextColor } from '@/types/colors'

import styles from './heading.module.scss'

interface HeadingProps {
  children: ReactNode
  color: TextColor
  className?: string
}
export function Heading({ children, color, className = '' }: HeadingProps) {
  const style: CSSProperties = {
    color: `var(--${color})`,
  }
  return (
    <h1 style={style} className={`${styles.heading} ${className}`}>
      {children}
    </h1>
  )
}
