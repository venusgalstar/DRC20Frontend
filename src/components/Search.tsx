import { ChangeEvent } from 'react'

import { DisplayType } from './marketplace/Trending'

type SearchProps = {
  searchValue: string
  displayedType?: DisplayType
  setSearchValue: React.Dispatch<React.SetStateAction<string>>
  handleSearchClick?: () => Promise<void>
}

function Search({ displayedType, searchValue, setSearchValue, handleSearchClick }: SearchProps) {
  const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newSearchValue = event.target.value
    if (displayedType === DisplayType.DRC20) {
      newSearchValue = newSearchValue?.slice(0, 4)
    }
    setSearchValue(newSearchValue)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && handleSearchClick) {
      handleSearchClick()
    }
  }

  return (
    <div className="bg-account-info-background rounded-lg border-2 border-account-page-default xs:mx-1 relative">
      <div className="flex flex-row items-center">
        <input
          className="my-1 mx-2 outline-none border-none text-sm xxs:w-20 xs:w-24 md:w-48"
          style={{borderRadius:'0px'}}
          type="text"
          value={searchValue}
          onChange={handleSearchValueChange}
          onKeyDown={handleKeyPress}
          placeholder="Search..."
        />
        <div className="absolute right-0 flex items-center pr-2 cursor-pointer" onClick={handleSearchClick}>
          <img src="/images/search.svg" alt="search" width={20} height={20} />
        </div>
      </div>
    </div>
  )
}

export default Search
