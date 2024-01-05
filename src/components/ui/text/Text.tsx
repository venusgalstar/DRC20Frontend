import cn from 'classnames'
import { CSSProperties, ReactNode } from 'react'

import { TextColor } from '@/types/colors'

import styles from './text.module.scss'

interface TextProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fontWeight?: 'thin' | 'normal' | 'bold' | 'extraBold'
  className?: string
  color?: TextColor
  children: ReactNode
  as?: 'p' | 'span'
}

export function Text({ size = 'xs', color = 'black', fontWeight = 'thin', className, children, as = 'p' }: TextProps) {
  const style: CSSProperties = {
    color: `var(--${color})`,
  }
  return as === 'p' ? (
    <p
      style={style}
      className={cn(
        styles.text,
        {
          [styles[size]]: size,
          [styles[fontWeight]]: fontWeight,
        },
        className
      )}
    >
      {children}
    </p>
  ) : (
    <span
      style={style}
      className={cn(
        styles.text,
        {
          [styles[size]]: size,
          [styles[fontWeight]]: fontWeight,
        },
        className
      )}
    >
      {children}
    </span>
  )
}
