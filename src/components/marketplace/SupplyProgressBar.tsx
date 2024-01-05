const ONE_THOUSAND = 1000
const ONE_MILLION = 1000000
const ONE_BILLION = 1000000000
const ONE_TRILLION = 1000000000000

const EDGE_CASE_ONE = 999500
const EDGE_CASE_TWO = 999500000
const EDGE_CASE_THREE = 999500000000

const SupplyProgressBar = ({ currentSupply, maxSupply }: { currentSupply: number; maxSupply: number }) => {
  const formatSupplyNumber = (supply: number) => {
    if (supply >= ONE_TRILLION) {
      return Math.round(supply / ONE_TRILLION) + 'T'
    } else if (supply >= ONE_BILLION) {
      return supply < EDGE_CASE_THREE ? Math.round(supply / ONE_BILLION) + 'B' : '999B'
    } else if (supply >= ONE_MILLION) {
      return supply < EDGE_CASE_TWO ? Math.round(supply / ONE_MILLION) + 'M' : '999M'
    } else if (supply >= ONE_THOUSAND) {
      return supply < EDGE_CASE_ONE ? Math.round(supply / ONE_THOUSAND) + 'K' : '999K'
    } else {
      return supply
    }
  }

  const supplyPercentage = Math.round((currentSupply / maxSupply) * 100).toString()

  return (
    <div className="flex flex-col lg:w-32 gap-1">
      <div className="flex flex-row justify-between">
        <span>{currentSupply === maxSupply ? '' : formatSupplyNumber(currentSupply)}</span>
        <span>{formatSupplyNumber(maxSupply)}</span>
      </div>
      <div className="bg-[#EFF2F5] rounded-lg">
        <div style={{ width: `${supplyPercentage}%` }} className={`bg-amber-500 p-1 rounded-lg`}></div>
      </div>
    </div>
  )
}

export default SupplyProgressBar
