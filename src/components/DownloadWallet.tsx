import { Button } from 'antd'

const DownloadWallet = () => {
  return (
    <>
      <div
        style={{
          backgroundColor: '#ffffff',
          boxShadow: 'rgba(88, 102, 126, 0.08) 0px 4px 24px, rgba(88, 102, 126, 0.12) 0px 1px 2px',
          borderRadius: '0px',
          height: '200px',
          padding: '1rem',
          marginBottom: '1rem',
          width: '100%',
        }}
      >
        <div className="flex flex-row justify-between gap-x-2">
          <div className="flex flex-col space-y-3">
            <div className="text-left font-bold" style={{ fontSize: '14px', maxWidth: '220px' }}>
              Doge Labs Wallet - Your gateway to the Doginals universe
            </div>
            <div className="text-left" style={{ fontSize: '8px' }}>
              A simple and elegant crypto wallet innovating how to store, receive and transfer Doginals securely on the
              Dogecoin network.
            </div>
            <Button
              style={{
                background: '#000',
                border: 'none',
                borderRadius: '0px',
                color: '#fff',
                fontWeight: 'bold',
                height: '40px',
                padding: '0 12px',
                justifyContent: 'flex-start',
              }}
              onClick={() => {
                window.open(
                  'https://chrome.google.com/webstore/detail/doge-labs-wallet/jiepnaheligkibgcjgjepjfppgbcghmp',
                  '_blank'
                )
              }}
            >
              <img width={'25px'} src="/github-mark.svg" style={{ marginRight: '1rem', display: 'none' }} />
              Install for Chrome
            </Button>
          </div>
          <div className="flex flex-col">
            <img style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto' }} src="/wallet-dl.png" />
          </div>
        </div>
      </div>
    </>
  )
}

export default DownloadWallet
