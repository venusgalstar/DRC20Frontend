import { IoIosArrowDropright } from 'react-icons/io'

const RightArrow = ({ handleNextSlide }: { handleNextSlide: () => void }) => {
  return (
    <div className="text-amber-500 xs:hidden sm:flex text-3xl hover:text-amber-700">
      <button onClick={handleNextSlide}>
        <IoIosArrowDropright />
      </button>
    </div>
  )
}

export default RightArrow
