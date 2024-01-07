import { useFetch } from 'usehooks-ts'

import { trustLevelBadge } from '@/utils'

type TokenNameWithTrustLevel = {
  tokenName: string
  height?: string
  width?: string
}

const TokenNameWithTrustLevel = ({ tokenName, height = '16px', width = '16px' }: TokenNameWithTrustLevel) => {
  const { data } = useFetch<any>(`https://d20-api2.dogeord.io/ticks/byName/${tokenName.toLowerCase()}`)
  return (
    <div
      style={{
        height,
        width,
        borderRadius: '100%',
        alignSelf: 'center',
        marginInline: '8px',
        backgroundSize: 'cover',
        backgroundImage: `url(${trustLevelBadge(data?.trustLevel)})`,
      }}
    />
  )
}

export default TokenNameWithTrustLevel
