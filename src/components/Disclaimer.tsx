import { Button } from 'antd'
import React from 'react'

export const disclaimerLatestVersionDate = Math.floor(new Date('2023-11-23 00:00:00').getTime() / 1000)

interface DisclaimerProps {
  acceptDisclaimer: (unixTimestamp: number) => void
  highlightColor?: string
}

const Disclaimer: React.FC<DisclaimerProps> = ({ acceptDisclaimer, highlightColor = '#feb628' }) => {
  return (
    <>
      <div
        style={{
          color: '#000000',
          backgroundColor: '#ffffff',
          boxShadow: 'rgba(88, 102, 126, 0.08) 0px 4px 24px, rgba(88, 102, 126, 0.12) 0px 1px 2px',
          borderRadius: '12px',
          minHeight: '290px',
          padding: '2rem',
          margin: '4rem auto',
          width: '100%',
          maxWidth: '640px',
        }}
      >
        <div className="flex flex-row justify-between gap-x-2">
          <div className="flex flex-col space-y-3">
            <div className="text-left font-bold" style={{ fontSize: '24px', maxWidth: '400px' }}>
              Welcome to the Doge Laboratory!
            </div>
            <div className="text-left" style={{ fontSize: '18px' }}>
              Please note, the Ordinals space is experimental. Use our services at your own risk. Rules may change and
              impact your transactions and balances. By using our website, you accept the Terms of Use. Proceed with
              excitement and caution.
            </div>
            <Button
              style={{
                background: highlightColor,
                border: 'none',
                borderRadius: '16px',
                color: '#fff',
                fontWeight: 'bold',
                height: '40px',
                padding: '0 12px',
                justifyContent: 'flex-start',
                marginTop: '2rem',
              }}
              onClick={() => acceptDisclaimer(Math.floor(Date.now() / 1000))}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Disclaimer
