import { useNavigate } from 'react-router-dom'

type DoginalShowTxModalProps = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  txHash: string
  collectionSymbol: string
}

const DoginalShowTxModal = ({ visible, setVisible, txHash, collectionSymbol }: DoginalShowTxModalProps) => {
  const navigator = useNavigate()

  const modalContainerStyle = `fixed left-0 top-0 right-0 bottom-0 bg-account-info-background bg-opacity-10 flex items-center justify-center
   ${
     visible
       ? 'opacity-100 z-50 backdrop-blur-sm transition-[opacity]'
       : 'opacity-0 -z-50 backdrop-blur-none transition-[z-index,opacity]'
   }`

  const closeShowTxModal = () => {
    setVisible(false)
    navigator(`/marketplace/doginals/${collectionSymbol}`)
  }

  const handleShowTxInExplorer = () => {
    window.open(`https://dogechain.info/tx/${txHash}`, '_blank')
  }

  return (
    <div className={modalContainerStyle}>
      <div className="flex flex-col px-3 bg-account-info-background rounded-lg border-2 border-account-page-default my-1">
        <div className="flex justify-between items-center my-3">
          <span className="text-sm font-bold">SUCCESSFUL BUY!</span>
          <button onClick={closeShowTxModal}>
            <img className="m-1" src="/images/clear.png" alt="Clear"></img>
          </button>
        </div>

        <span className="flex justify-between items-center mb-2 text-xs">
          Disclaimer: If you encounter an error, please refresh the explorer page a few times.
        </span>

        <div className="flex flex-row my-1 justify-center">
          <button
            className="bg-account-page-default font-semibold text-black text-lg rounded-lg px-8 py-1 my-3 mx-3"
            onClick={closeShowTxModal}
          >
            Go back
          </button>

          <button
            className="bg-selected-color font-semibold text-white text-lg rounded-lg px-8 py-1 my-3 mx-3"
            onClick={handleShowTxInExplorer}
          >
            See transaction in explorer
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoginalShowTxModal
