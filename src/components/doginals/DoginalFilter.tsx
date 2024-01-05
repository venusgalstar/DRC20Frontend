import { FilterOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'

import { getCollectionMetadata } from '@/api'
import { ToggleSwitch } from '@/pages/marketplace/DoginalsCollectionPage'

interface DoginalFilterProps {
  collectionSymbol: string
  showCollectionOffers: boolean
  setShowCollectionOffers: (value: boolean) => void
  onMetadataChange: (metadata: Record<string, string>) => void
  filterOpen: boolean
  setFilterOpen: (value: boolean) => void
  selectedTags: Record<string, string | null>
  setSelectedTags: (callback: (prevTags: Record<string, string | null>) => Record<string, string | null>) => void
}

const DoginalFilter: React.FC<DoginalFilterProps> = ({
  collectionSymbol,
  showCollectionOffers,
  setShowCollectionOffers,
  onMetadataChange,
  filterOpen,
  setFilterOpen,
  selectedTags,
  setSelectedTags,
}) => {
  const [categoryOpenState, setCategoryOpenState] = useState<Record<string, boolean>>({})
  const [doginalsData, setDoginalsData] = useState<Record<string, any[]> | undefined>(undefined)

  const fetchMetadata = async () => {
    try {
      const metadataResponse = await getCollectionMetadata(collectionSymbol)
      setDoginalsData(metadataResponse.metadata)
    } catch (error) {
      console.error('Error fetching metadata:', error)
    }
  }

  useEffect(() => {
    fetchMetadata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionSymbol])

  const handleTagClick = (key: string, value: string) => {
    setSelectedTags((prevTags: Record<string, string | null>) => {
      const updatedSelectedTags = { ...prevTags }

      Object.keys(updatedSelectedTags).forEach((categoryKey) => {
        if (categoryKey === key) {
          return
        }
        updatedSelectedTags[categoryKey] = null
      })

      if (updatedSelectedTags[key] === value) {
        updatedSelectedTags[key] = null
      } else {
        updatedSelectedTags[key] = value
      }

      const filteredTags: Record<string, string> = {}
      for (const [categoryKey, tagValue] of Object.entries(updatedSelectedTags)) {
        if (tagValue !== null) {
          filteredTags[categoryKey] = tagValue
        }
      }

      onMetadataChange(filteredTags)
      return updatedSelectedTags
    })
  }

  const handleCategoryToggle = (key: string) => {
    setCategoryOpenState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }))
  }

  const toggleFilter = () => {
    setFilterOpen(!filterOpen)
  }

  const shouldHideFilters = !doginalsData || Object.keys(doginalsData).length === 0

  return (
    <div className={`${filterOpen ? 'mr-0' : 'mr-2'}`}>
      <button
        className={`py-2 border-account-page-background mr-2 ${
          filterOpen
            ? 'w-40 lg:w-60 text-left pl-2 border-t-2 border-l-2 border-r-2 border-b-0 rounded-t rounded-b-none'
            : 'w-10 text-center border-2 rounded'
        }`}
        onClick={toggleFilter}
      >
        <FilterOutlined style={{ fontSize: '20px' }} />
      </button>

      <div
        className={`border-2 rounded rounded-t-none flex-col h-min mr-2 w-40 lg:w-60 border-account-page-background ${
          filterOpen ? 'flex' : 'hidden'
        }`}
      >
        <ul>
          <div className="border-b-2 flex py-3 justify-start px-2 border-account-page-background">
            <ToggleSwitch onChange={() => setShowCollectionOffers(!showCollectionOffers)} />
          </div>

          {Object.entries(doginalsData || {}).map(
            ([key, values]) =>
              !shouldHideFilters && (
                <li key={key} className="px-1 w-full">
                  <button
                    className="w-full text-left px-1 py-2 rounded flex items-center justify-between"
                    onClick={() => handleCategoryToggle(key)}
                  >
                    <div className="flex gap-2">
                      <label className="block text-base font-medium text-left">{key}</label>
                    </div>
                    <span className="focus:outline-none">
                      {categoryOpenState[key] ? <FaAngleDown /> : <FaAngleUp />}
                    </span>
                  </button>
                  {categoryOpenState[key] && (
                    <div className="flex flex-wrap">
                      {values.map((value) => (
                        <button
                          key={value}
                          className={`mr-2 mb-2 w-full px-2 py-1 rounded-lg text-left text-sm font-medium bg-account-page-default ${
                            selectedTags
                              ? selectedTags[key]?.includes(value)
                                ? 'border border-selected-color'
                                : 'border-none'
                              : 'border-none'
                          }`}
                          onClick={() => handleTagClick(key, value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  )
}

export default DoginalFilter
