import axios from 'axios'

export const http = axios.create({
  baseURL: '/',
})

http.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
http.interceptors.response.use(
  async ({ data }) => {
    if (data.error) {
      throw new Error(data.error)
    }
    return data
  },
  async ({ response }) => {
    if (response && response.data && response.data.error) {
      throw new Error(response.data.error)
    } else {
      console.error(response)
      throw new Error('Network Error')
    }
  }
)

export const post = http.post as <T>(...rest: Parameters<typeof http.post>) => Promise<T>
export const get = http.get as <T>(...rest: Parameters<typeof http.get>) => Promise<T>
export const deleteApi = http.delete as <T>(...rest: Parameters<typeof http.delete>) => Promise<T>
