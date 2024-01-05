import React from 'react'

type InfoContainerProps = {
  head?: React.ReactNode
  body: React.ReactNode
}

const InfoContainer = ({ head, body }: InfoContainerProps) => {
  return (
    <div
      style={{
        height: 'fit-content',
        maxWidth: '1280px',
        backgroundColor: '#fff',
        border: '2px solid #f5f5f5',
        borderRadius: '16px',
        padding: '24px',
      }}
    >
      {head && (
        <div style={{ height: 'fit-content', borderBottom: '2px solid #f5f5f5', paddingBottom: '24px' }}>{head}</div>
      )}
      <div>{body}</div>
    </div>
  )
}

export default InfoContainer
