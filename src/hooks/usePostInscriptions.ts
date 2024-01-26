import { InscriptionType } from '@/pages/service/inscribe'
import { useMemo, useCallback } from 'react';

type usePostProps = {
  type: InscriptionType
  contents: Object[] | any[] | null
  receivingAddress: string
}

const usePostInscriptions = ({ type, contents, receivingAddress }: usePostProps) => {
  const requestConfig = useMemo(() => {
    const baseUrl = import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api2.dogeord.io'
    if (!contents) return null

    switch (type) {
      case 'drc-20':
        return {
          //url: `${baseUrl}/inscribe/job/drc-20`,
          url: `https://thedragontest.com/api/inscribe/job/drc-20`,
          requestData: {
            receiverConfigs: [{ amount: 1, address: receivingAddress }],
            inscriptionContent: contents,
          },
        }
      case 'Text':
        return {
          url: `${baseUrl}/inscribe/job/text`,
          requestData: {
            receiverConfigs: [{ amount: 1, address: receivingAddress }],
            inscriptionContent: contents,
          },
        }
      case 'Files':
        return {
          url: `${baseUrl}/inscribe/job/file`,
          requestData: {
            receiverConfigs: [{ amount: 1, address: receivingAddress }],
          },
        }
      case '.dogemap':
        return {
          url: `${baseUrl}/inscribe/job/dogemap`,
          requestData: {
            receiverConfigs: [{ amount: 1, address: receivingAddress }],
            inscriptionContent: contents,
          },
        }
    }
  }, [contents, receivingAddress, type])

  return useCallback(
    async (isPriority: boolean) => {
      if (!requestConfig || (!requestConfig.url && !requestConfig.requestData)) return

      try {
        if (type === 'Files') {
          if (!contents || !contents[0].data) return null
          const file = contents[0].data
          let formData = new FormData()
          formData.append('zippedInscribeSources', file, file?.name)
          formData.append('receiverConfigs', JSON.stringify(requestConfig.requestData.receiverConfigs))
          formData.append('isPriority', isPriority.toString())

          const response = await fetch(requestConfig.url, {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            throw new Error(response.statusText)
          }

          const data = await response.json()
          return data
        } else {
//Changed by alleycat1: for geting fee wallet and cost
          const response = await fetch(requestConfig.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...requestConfig.requestData, isPriority }),
          })

          const data = await response.json()
          return data
        }
      } catch (error: any) {
        console.log({ error })
        throw new Error('Something went wrong.')
      }
    },
    [contents, requestConfig, type]
  )
}

export default usePostInscriptions
