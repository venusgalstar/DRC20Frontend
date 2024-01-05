import Sentry from '@/main'

type Response<T> = {
  res: T | null
  err: Error | null
}

const isError = (err: any): err is Error => {
  if (typeof err !== 'object') {
    return false
  }

  return (err as Error).message !== undefined
}

export const executeAsync = async <T>(handler: () => Promise<T>): Promise<Response<T>> => {
  try {
    const res = await handler()
    return { res, err: null }
  } catch (err) {
    if (isError(err)) {
      Sentry.captureException(err)
      console.error(JSON.stringify(err))
      return { res: null, err }
    }

    Sentry.captureException('Unknown error occured')
    throw new Error('Unknown error occured')
  }
}
