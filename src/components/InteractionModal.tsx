import { Modal } from 'antd'
import React from 'react'

type InteractionModalProps = {
  children: React.ReactNode
  onClose: () => void
  title?: string
  style?: React.CSSProperties
}
const InteractionModal = ({ children, onClose, title, style }: InteractionModalProps) => {
  return (
    <Modal open title={title} onCancel={onClose} footer={false} style={{ ...style }}>
      {children}
    </Modal>
  )
}

export default InteractionModal
