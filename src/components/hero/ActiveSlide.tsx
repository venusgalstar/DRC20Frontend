const ActiveSlide = ({ slide, numberOfSlides }: { slide: number; numberOfSlides: number }) => {
  const renderDivs = () => {
    return Array.from({ length: numberOfSlides }, (_, index) => (
      <div key={index} className={`${slide === index ? 'bg-amber-500' : 'bg-[#EFF2F5]'} py-1 px-3 rounded-lg`}></div>
    ))
  }

  return <div className="flex flex-row gap-1 xs:mb-10 sm:mb-0">{renderDivs()}</div>
}

export default ActiveSlide
