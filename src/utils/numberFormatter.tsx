import numeral from 'numeral'

numeral.localeData('en').abbreviations = {
  thousand: ' ',
  million: ' ',
  billion: ' ',
  trillion: ' ',
}

export const numberFormatter: (
  value: number | string,
  isShorthand?: boolean,
  hideDecimals?: boolean
) => JSX.Element | undefined = (value, isShorthand = false, hideDecimals = false) => {
  const absValue = Math.abs(value as number)
  if (Number(absValue) < 0.1) {
    return <span>{numeral(value).format(`0.00000`, Math.floor)}</span>
  } else if (absValue < 1) {
    return <span>{numeral(value).format(`0.0000`, Math.floor)}</span>
  } else if (absValue < 1000) {
    return <span>{numeral(value).format(`0,0${hideDecimals ? '' : '.00'}`, Math.floor)}</span>
  } else if (absValue > 1000000000000000) {
    return (
      <span>
        {numeral(value).format(`0,0.00e+0`, Math.floor).split('e+')[0]}
        <span>
          <sup> *10^{numeral(value).format(`0,0.00e+0`, Math.floor).split('e+')[1]}</sup>
        </span>
      </span>
    )
  } else {
    return (
      <div>
        <span>{numeral(value).format(`0,0${isShorthand ? 'a' : ''}`, Math.floor)}</span>
        {isShorthand && symbol(value)}
      </div>
    )
  }
}

export const currencyFormatter: (
  value: number | string,
  isShorthand?: boolean,
  symbolPrice?: boolean | string,
  hideDecimals?: boolean
) => JSX.Element | undefined = (value, isShorthand = false, symbolPrice = false, hideDecimals = false) => {
  const absValue = Math.abs(Number(value))
  if (Number(absValue) < 0.01) {
    return (
      <span>{numeral(value).format(`${symbolPrice ? null : '$'}0${hideDecimals ? '' : '.00000'}`, Math.floor)}</span>
    )
  } else if (Number(absValue) < 0.1) {
    return (
      <span>{numeral(value).format(`${symbolPrice ? null : '$'}0${hideDecimals ? '' : '.0000'}`, Math.floor)}</span>
    )
  } else if (absValue < 1) {
    return <span>{numeral(value).format(`${symbolPrice ? null : '$'}0${hideDecimals ? '' : '.00'}`, Math.floor)}</span>
  } else if (absValue < 1000) {
    return (
      <span>{numeral(value).format(`${symbolPrice ? null : '$'}0,0${hideDecimals ? '' : '.00'}`, Math.floor)}</span>
    )
  } else if (absValue < 10000) {
    return <span>{numeral(value).format(`${symbolPrice ? null : '$'}0,0`, Math.floor)}</span>
  } else if (absValue < 100000) {
    return <span>{numeral(value).format(`${symbolPrice ? null : '$'}0,0`, Math.floor)}</span>
  } else if (absValue > 1000000000000000) {
    return (
      <span>
        {
          numeral(value)
            .format(`${symbolPrice ? null : '$'}0,0.00e+0`, Math.floor)
            .split('e+')[0]
        }
        <span>
          <sup> *10^{numeral(value).format(`0,0.00e+0`, Math.floor).split('e+')[1]}</sup>
        </span>
      </span>
    )
  } else {
    return (
      <div>
        <span>{numeral(value).format(`${symbolPrice ? null : '$'}0,0${isShorthand ? 'a' : ''}`, Math.floor)}</span>
        {isShorthand && symbol(value)}
      </div>
    )
  }
}

const symbol = (value: number | string) => {
  if (Number(value) >= 1000000000000) {
    return (
      <span
        style={{
          fontSize: '10px !important',
          display: 'contents',
        }}
      >
        T
      </span>
    )
  } else if (Number(value) >= 1000000000) {
    return (
      <span
        style={{
          fontSize: '10px !important',
          display: 'contents',
        }}
      >
        B
      </span>
    )
  } else if (Number(value) >= 1000000) {
    return (
      <span
        style={{
          fontSize: '10px !important',
          display: 'contents',
        }}
      >
        M
      </span>
    )
  } else if (Number(value) >= 1000) {
    return (
      <span
        style={{
          fontSize: '10px !important',
          display: 'contents',
        }}
      >
        K
      </span>
    )
  }
}

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`
}
