import { MdRefresh } from 'react-icons/md'
import React, { useEffect, useState, useMemo, useCallback } from 'react';

const RefreshButton = ({
  refetchData,
  setIsSorting,
}: {
  refetchData: () => void
  setIsSorting: (isSorting: boolean) => void
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefreshClick = useCallback(async () => {
    setIsSorting(true)
    setIsRefreshing(true)
    await refetchData()
    setIsSorting(false)
    setIsRefreshing(false)
  }, [refetchData, setIsSorting])

  const noop = useCallback(() => {}, [])

  return (
    <button
      className="xxs:hidden xs:flex border-2 border-[#EFF2F5] rounded-lg text-amber-500 text-xl p-1 hover:text-amber-700"
      disabled={isRefreshing}
      onClick={isRefreshing ? noop : handleRefreshClick}
    >
      <MdRefresh className={isRefreshing ? 'spin' : ''} />
    </button>
  )
}

export default RefreshButton
