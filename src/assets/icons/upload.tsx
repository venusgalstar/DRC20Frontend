import Icon from '@ant-design/icons'

type Props = any

const IconSVG = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M30.0003 24.9998V29.9998H10.0003V24.9998H6.66699V29.9998C6.66699 31.8332 8.16699 33.3332 10.0003 33.3332H30.0003C31.8337 33.3332 33.3337 31.8332 33.3337 29.9998V24.9998H30.0003ZM11.667 14.9998L14.017 17.3498L18.3337 13.0498V26.6665H21.667V13.0498L25.9837 17.3498L28.3337 14.9998L20.0003 6.6665L11.667 14.9998Z"
      fill="black"
    />
  </svg>
)

export const UploadIcon = (props: Props) => {
  return <Icon component={IconSVG} {...props} />
}
