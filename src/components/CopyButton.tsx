import {useState} from 'react'
import Icon, { CheckCircleOutlined } from '@ant-design/icons'
import copy from 'copy-to-clipboard'

type Props = any

type CopyButtonProps = {
  text: string
}

const IconSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.5 1H4.5C3.4 1 2.5 1.9 2.5 3V17H4.5V3H16.5V1ZM19.5 5H8.5C7.4 5 6.5 5.9 6.5 7V21C6.5 22.1 7.4 23 8.5 23H19.5C20.6 23 21.5 22.1 21.5 21V7C21.5 5.9 20.6 5 19.5 5ZM19.5 21H8.5V7H19.5V21Z"
      fill="#232530"
    />
  </svg>
)

const CopyIcon = (props: Props) => {
  return <Icon component={IconSVG} {...props} className="cursor-pointer" />
}

const CopyButton = ({ text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    copy(text)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return <span onClick={handleCopy}>{copied ? <CheckCircleOutlined className="text-green-400" /> : <CopyIcon />}</span>
}

export default CopyButton
