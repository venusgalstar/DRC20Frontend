const HeroButton = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return (
    <div className="flex w-full items-center justify-start md:justify-center">
      <button
        className="xs:px-3 xs:py-1 md:py-1 md:px-7 text-white rounded-lg uppercase text-sm font-medium bg-selected-color md:text-lg hover:text-white"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  )
}

export default HeroButton
