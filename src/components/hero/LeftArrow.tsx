import { IoIosArrowDropleft } from 'react-icons/io'

const LeftArrow = ({ handlePreviousSlide }: { handlePreviousSlide: () => void }) => {
  return (
    <div className="text-amber-500 xs:hidden sm:flex text-3xl hover:text-amber-700">
      <button onClick={handlePreviousSlide}>
        <IoIosArrowDropleft />
      </button>
    </div>
  )
}

export default LeftArrow
