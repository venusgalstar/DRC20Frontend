import { useFetch } from 'usehooks-ts'

import { TokenHolderInfo } from '@/types/tokenHolderInfo'

/*
const mockData: TokenHolderInfo[] = [
  { rank: 1, address: 'D6aPHgCv4HPMS4dqivbmXstSoPfsB8xZFA', percentage: 10, value: 1000 },
  { rank: 2, address: 'D9bS1JXcVc9KuyvZm1pYtbGFCR9NnATsWx', percentage: 8, value: 800 },
  { rank: 3, address: 'D8pE8sCZzgprJqsMExQH6Dx4Rtrg5TmBDh', percentage: 7, value: 700 },
  { rank: 4, address: 'DDe3yFForPRwEEJnsYyHbXByjxV51VuDpK', percentage: 6.6, value: 660 },
  { rank: 5, address: 'DThCHQFgtUKF3YoUpGoDq5ViZgCGhQynYb', percentage: 6, value: 600 },
  { rank: 6, address: 'DCtT7Ny2NwqifFQSTLXX7YUPLGR7uxaxSk', percentage: 5, value: 500 },
  { rank: 7, address: 'D5fCMs3Bb4EXGQ2hqFYQ67BSbnTQxr8Vqw', percentage: 5.12, value: 512 },
  { rank: 8, address: 'D7R7yRZtkYjqHzHjZwUGgQtB8QRytgSGmu', percentage: 4, value: 400 },
  { rank: 9, address: 'DJiJgCQxqZ4HwihT2a5NzFCJxN7Kdtk1vM', percentage: 3, value: 300 },
  { rank: 10, address: 'DKXGryu6X61fGr6s6qyJjc8TJJp32ZJyKg', percentage: 3.12, value: 312 },
  { rank: 11, address: 'DQ5JZwMXuV3AfJ3zBtsvFz9UgSeSDZtWTY', percentage: 3.1, value: 310 },
  { rank: 12, address: 'DDzzrxtt5kDhnQ3b3QZfVeLcz3LfuQ69NT', percentage: 3, value: 300 },
  { rank: 13, address: 'D9RM6bYXv6PHtPmztUkGvRuj3zT3e9o4H6', percentage: 2, value: 200 },
  { rank: 14, address: 'DQ6G3fycm2xXnCpTWjSfnyTzoc1PpqZLcF', percentage: 1.9, value: 190 },
  { rank: 15, address: 'D5uBShhqbr7e1TkZRbBYNzq8sZdNUeXNtX', percentage: 1.8, value: 180 },
  { rank: 16, address: 'DErPrw7idAJzRHrVJ7xvz6zgKYRxmN2w7y', percentage: 1.7, value: 170 },
  { rank: 17, address: '0xD7NwXzxZ6wJvhEZnEJB1Sn68C9L2XB6vnm123', percentage: 1.6, value: 160 },
  { rank: 18, address: 'DS6SSyYtkEUGWUaBbXtn3S4DVuBFQy8f28', percentage: 1.5, value: 150 },
  { rank: 19, address: 'DSezEviEbYChf1J1JibPRzZVeNBSoKvNkg', percentage: 1.4, value: 140 },
  { rank: 20, address: 'DNuZ3P7ZyyMThXkwYPj4TVkT3ayAqY2SjT', percentage: 1.3, value: 130 },
  { rank: 21, address: 'DJuVtsL4r3RiYJJKk4A5N4x2umwA2k4q3c', percentage: 1.2, value: 120 },
  { rank: 22, address: 'DC1p6ikYMPX6y8LCCptxvZPgy3p3q5zoaU', percentage: 1.1, value: 110 },
  { rank: 23, address: 'DC3p69kYMPX6y8LCCptxvZPgy3p3q5zoaA', percentage: 1, value: 100 },
]
*/

type useTokenHoldersInfoProps = {
  tokenSymbol: string
}

type HookReturn = {
  data: TokenHolderInfo[] | unknown
  error: Error | undefined
}

const useTokenHoldersInfo = ({ tokenSymbol }: useTokenHoldersInfoProps): HookReturn => {
  const baseUrl = import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api2.dogeord.io'
  const url = `${baseUrl}/trading/tokenholderinfo/${tokenSymbol}?size=10000&page=0`
  const { data, error } = useFetch(url)

  return { data, error }
}

export default useTokenHoldersInfo
