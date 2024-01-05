import Icon from '@ant-design/icons'

type Props = any

const IconSVG = () => (
  <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M75 12.5C40.5 12.5 12.5 40.5 12.5 75C12.5 109.5 40.5 137.5 75 137.5C109.5 137.5 137.5 109.5 137.5 75C137.5 40.5 109.5 12.5 75 12.5ZM75 125C47.4375 125 25 102.562 25 75C25 47.4375 47.4375 25 75 25C102.562 25 125 47.4375 125 75C125 102.562 102.562 125 75 125ZM103.688 47.375L62.5 88.5625L46.3125 72.4375L37.5 81.25L62.5 106.25L112.5 56.25L103.688 47.375Z"
      fill="#80ED99"
    />
  </svg>
)

export const CheckCircleIcon = (props: Props) => {
  return <Icon component={IconSVG} {...props} />
}
