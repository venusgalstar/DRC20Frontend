import axios from 'axios'
import axiosRetry from 'axios-retry'

axiosRetry(axios, {
  retries: 10,
  retryDelay: (retryCount) => {
    return retryCount * 2000
  },
})

export const fetch = async (url: string, callback: (result: any) => void) => {
  axios
    .get(url)
    .then((result) => {
      callback(result)
    })
    .catch((error) => {
      console.log(error)
    })
}

export const fetchIntervall = async (url: string, callback: (result: any) => void, intervallMs: number) => {
  setInterval(async () => {
    fetch(url, callback)
  }, intervallMs)
  fetch(url, callback)
}

export default fetch
