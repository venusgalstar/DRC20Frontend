import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { ReactNode, useMemo } from 'react'

import { Text } from '@/components/ui'

import styles from './customButton.module.scss'

interface ButtonProps {
  onClick: () => void
  label: string | ReactNode
  className?: string
  isDisabled?: boolean
  isLoading?: boolean
}

export function CustomButton({ className = '', isLoading, isDisabled, label, onClick }: ButtonProps) {
  const buttonContent = useMemo(() => {
    if (isLoading) {
      return <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
    }
    if (typeof label === 'string') {
      return (
        <Text size="lg" fontWeight="extraBold" color="white">
          {label}
        </Text>
      )
    }
    return label
  }, [isLoading, label])
  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`${styles.button} ${isLoading || isDisabled ? styles.isDisabled : ''} ${className}`}
    >
      {buttonContent}
    </button>
  )
}
