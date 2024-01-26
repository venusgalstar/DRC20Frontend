import { useCallback } from 'react'
import { InscriptionType } from '@/pages/service/inscribe'

type InscriptionPricingArgs = {
  inscriptionType: InscriptionType
  contents: Object[] | any[] | null
}

const useInscriptionPricing = ({ inscriptionType, contents }: InscriptionPricingArgs) => {
  const makeInscriptionPricingRequest = useCallback(
    async (isPriority: boolean) => {
      const requestConfig = () => {
        const baseUrl = import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api2.dogeord.io'
        if (!contents || !inscriptionType) return null

        switch (inscriptionType) {
          case 'drc-20':
            return {
              url: `https://thedragontest.com/api/inscribe/job/drc-20/pricing`,
              requestData: {
                inscriptionContent: contents,
              },
            }
          case 'Text':
            return {
              url: `${baseUrl}/inscribe/job/text/pricing`,
              requestData: {
                inscriptionContent: contents,
              },
            }
          case 'Files':
            return {
              url: `${baseUrl}/inscribe/job/file/pricing`,
            }
          case '.dogemap':
            return {
              url: `${baseUrl}/inscribe/job/dogemap/pricing`,
              requestData: {
                inscriptionContent: contents,
              },
            }
        }
      }
      const requestConf = requestConfig()

      if (!requestConf) return null
      try {
        if (inscriptionType === 'Files') {
          if (!contents || contents.length < 1 || !contents[0].data) return null
          const file = contents[0].data
          let formData = new FormData()
          formData.append('zippedInscribeSources', file, file?.name)
          formData.append('isPriority', isPriority.toString())

          const response = await fetch(requestConf.url, {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            throw new Error(`${response.status} -  ${response.statusText} - ${await response.text()}`)
          }

          const data = await response.json()
          return data
        } else {
          // we fetch twice to get the priority and non priority pricing
          const response = await fetch(requestConf.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...requestConf.requestData, isPriority }),
          })

          if (!response.ok) {
            throw new Error(`${response.status} -  ${response.statusText} - ${await response.text()}`)
          }

          const data = await response.json()
          return data
        }
      } catch (e: any) {
        console.log(e)
        throw new Error(e?.message ?? 'Something went wrong.')
      }
    },
    [inscriptionType, contents]
  )

  return makeInscriptionPricingRequest
}

export default useInscriptionPricing
