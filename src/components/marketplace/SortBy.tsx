import React, { useEffect, useRef, useState } from 'react'

import { SortByTypes } from './Trending'

type SortByProps = {
  selectedSortType: SortByTypes
  setSelectedSortType: React.Dispatch<React.SetStateAction<SortByTypes>>
}

const SortBy = ({ selectedSortType, setSelectedSortType }: SortByProps) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen)
  }

  const handleSortSelection = (sortType: SortByTypes) => {
    setSelectedSortType(sortType)
    setDropdownOpen(false)
  }

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
      setDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  return (
    <div className="flex flex-col items-start border-b-2 border-[#EFF2F5]">
      <div className="flex justify-end w-full">
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            type="button"
            className="inline-flex justify-center w-full py-5 text-sm font-normal text-gray-700"
            onClick={toggleDropdown}
          >
            {selectedSortType}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 14.293a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L10 11.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 xs:w-32 md:w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="none">
                <button
                  className={`block px-4 py-2 text-sm w-full ${
                    selectedSortType === SortByTypes.VolumeDescending
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => handleSortSelection(SortByTypes.VolumeDescending)}
                >
                  Volume: High to Low
                </button>
                <button
                  className={`block px-4 py-2 text-sm w-full ${
                    selectedSortType === SortByTypes.VolumeAscending
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => handleSortSelection(SortByTypes.VolumeAscending)}
                >
                  Volume: Low to High
                </button>
                <button
                  className={`block px-4 py-2 text-sm w-full ${
                    selectedSortType === SortByTypes.PriceAscending
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => handleSortSelection(SortByTypes.PriceAscending)}
                >
                  Price: Low to High
                </button>
                <button
                  className={`block px-4 py-2 text-sm w-full ${
                    selectedSortType === SortByTypes.PriceDescending
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => handleSortSelection(SortByTypes.PriceDescending)}
                >
                  Price: High to Low
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SortBy
