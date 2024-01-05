import { DownOutlined, UpOutlined } from '@ant-design/icons'
import React, { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'

import {
  createDoginal,
  createDoginalCollection,
  createFeature,
  Feature,
  FeatureDto,
  getFeatures,
  updateFeatures,
} from '@/api'
import BaseButton from '@/components/BaseButton'
import CustomToastContainer from '@/components/CustomToastContainer'
import InputField from '@/components/InputField'
import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import useToast from '@/hooks/useToast'
import { DoginalsCollectionData } from '@/types/dogeNft'
import { generateJwt } from '@/utils/helpers'
import { useWalletContext } from '@/WalletContext'

import PageBase from '../_base'

type DoginalsCollectionDto = {
  name: string
  symbol: string
  description: string
  imageURI: string
  twitterLink: string
  discordLink: string
  websiteLink: string
}

type ToggleSwitchProps = {
  onChange: () => void
}
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ onChange }) => {
  return (
    <div className="flex justify-center items-center w-full mb-10">
      <span className="mr-2 text-base font-medium">Feature Banner Manager</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" onChange={onChange} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-[#FFB627]"></div>
      </label>
    </div>
  )
}

const CreateFeatureForm: React.FC = () => {
  const toast = useToast()
  const { address } = useWalletContext()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FeatureDto>({
    header: '',
    description: {
      '1': '',
    },
    CTAText: '',
    CTALink: '',
    imageLink: '',
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await createFeature(formData, address)
      toast.showSuccessToast('Successfully created feature')
      setFormData({
        header: '',
        description: {
          '1': '',
        },
        CTAText: '',
        CTALink: '',
        imageLink: '',
      })
    } catch (error) {
      if (error instanceof Error) {
        await generateJwt(address)
        await createFeature(formData, address)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleDescriptionChange = (paragraphNumber: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      description: {
        ...prevData.description,
        [paragraphNumber]: value,
      },
    }))
  }

  const addParagraph = () => {
    const paragraphCount = Object.keys(formData.description).length + 1
    setFormData((prevData) => ({
      ...prevData,
      description: {
        ...prevData.description,
        [`${paragraphCount}`]: '',
      },
    }))
  }

  const removeParagraph = () => {
    const paragraphCount = Object.keys(formData.description).length
    if (paragraphCount > 1) {
      const newDescription = { ...formData.description }
      delete newDescription[`${paragraphCount}`]
      setFormData((prevData) => ({
        ...prevData,
        description: newDescription,
      }))
    }
  }

  return (
    <div className="rounded-xl border-2">
      {isLoading && <LoadingView isFixed={true} />}
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setIsLoading(true)
          await handleSubmit(e)
        }}
        className="flex justify-center pb-12"
      >
        <div className="flex flex-col items-center w-1/2">
          <InputField
            label="Header"
            name="header"
            placeholder="Enter feature header"
            value={formData.header}
            onChange={handleChange}
          />
          {Object.entries(formData.description).map(([paragraphNumber, value]) => (
            <textarea
              key={paragraphNumber}
              name={`description${paragraphNumber}`}
              placeholder={`Enter description paragraph ${paragraphNumber}`}
              value={value}
              onChange={(e) => handleDescriptionChange(paragraphNumber, e.target.value)}
              className="block mb-4 p-2.5 w-full text-sm bg-white rounded-lg border focus:ring-offset-selected-color focus:border-selected-color"
              rows={3}
            />
          ))}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={addParagraph}
              className="p-2 border-1 bg-selected-color text-white font-medium rounded-lg"
            >
              Add Paragraph
            </button>
            <button
              type="button"
              onClick={removeParagraph}
              className="p-2 border-1 bg-selected-color text-white font-medium rounded-lg"
            >
              Remove Paragraph
            </button>
          </div>
          <InputField
            label="CTAText"
            name="CTAText"
            placeholder="Enter CTA text"
            value={formData.CTAText}
            onChange={handleChange}
          />
          <InputField
            label="CTALink"
            name="CTALink"
            placeholder="Enter CTA link"
            value={formData.CTALink}
            onChange={handleChange}
          />
          <InputField
            label="ImageLink"
            name="imageLink"
            placeholder="Enter image link"
            value={formData.imageLink}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 border-1 bg-selected-color text-white font-medium rounded-lg"
          >
            Create Feature
          </button>
        </div>
      </form>
    </div>
  )
}

type FeaturesRowProps = {
  feature: Feature
  onEdit: (feature: Feature, field: string, value: string) => void
  onMoveUp: (feature: Feature) => void
  onMoveDown: (feature: Feature) => void
  onToggleVisibility: (feature: Feature) => void
}

const FeaturesRow: React.FC<FeaturesRowProps> = ({ feature, onEdit, onMoveUp, onMoveDown, onToggleVisibility }) => {
  const handleEdit = (field: string, value: string) => {
    onEdit(feature, field, value)
  }

  return (
    <div className="border-2 p-2 flex justify-between w-1/2 flex-1 rounded-xl">
      <p className="w-4/6">{feature.header}</p>

      <button onClick={() => onMoveUp(feature)} className="w-1/6">
        <UpOutlined />
      </button>
      <button onClick={() => onMoveDown(feature)} className="w-1/6">
        <DownOutlined />
      </button>

      <label className="w-1/6 flex gap-1">
        Visible:
        <input type="checkbox" checked={feature.visible} onChange={() => onToggleVisibility(feature)} />
      </label>
    </div>
  )
}

type FeaturesManagerProps = {
  features: Feature[]
  onSaveChanges: (updatedFeatures: Feature[]) => void
}

const FeaturesManager: React.FC<FeaturesManagerProps> = ({ features, onSaveChanges }) => {
  const [editedFeatures, setEditedFeatures] = useState<Feature[]>(features)

  const updateFeatureIndex = (features: Feature[]) => {
    return features.map((feature, index) => ({ ...feature, index: index + 1 }))
  }

  const handleEdit = (feature: Feature, field: string, value: string) => {
    const updatedFeatures = editedFeatures.map((f) => (f.header === feature.header ? { ...f, [field]: value } : f))
    setEditedFeatures(updateFeatureIndex(updatedFeatures))
  }

  const handleMoveUp = (feature: Feature) => {
    const currentIndex = editedFeatures.findIndex((f) => f.header === feature.header)
    if (currentIndex > 0) {
      const updatedFeatures = [...editedFeatures]
      ;[updatedFeatures[currentIndex], updatedFeatures[currentIndex - 1]] = [
        updatedFeatures[currentIndex - 1],
        updatedFeatures[currentIndex],
      ]
      setEditedFeatures(updateFeatureIndex(updatedFeatures))
    }
  }

  const handleMoveDown = (feature: Feature) => {
    const currentIndex = editedFeatures.findIndex((f) => f.header === feature.header)
    if (currentIndex < editedFeatures.length - 1) {
      const updatedFeatures = [...editedFeatures]
      ;[updatedFeatures[currentIndex], updatedFeatures[currentIndex + 1]] = [
        updatedFeatures[currentIndex + 1],
        updatedFeatures[currentIndex],
      ]
      setEditedFeatures(updateFeatureIndex(updatedFeatures))
    }
  }

  const handleToggleVisibility = (feature: Feature) => {
    const updatedFeatures = editedFeatures.map((f) => (f.header === feature.header ? { ...f, visible: !f.visible } : f))
    setEditedFeatures(updateFeatureIndex(updatedFeatures))
  }

  const handleSaveChanges = () => {
    onSaveChanges(editedFeatures)
    // Reset state or perform other actions after saving changes
  }

  return (
    <div className="flex flex-col gap-2 items-center mb-2">
      {editedFeatures.map((feature) => (
        <FeaturesRow
          key={feature.header}
          feature={feature}
          onEdit={handleEdit}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onToggleVisibility={handleToggleVisibility}
        />
      ))}
      {features.length > 0 && (
        <button onClick={handleSaveChanges} className="p-2 bg-selected-color text-white rounded-lg">
          Save Changes
        </button>
      )}
    </div>
  )
}

const CreateCollectionForm: React.FC = () => {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<DoginalsCollectionDto>({
    name: '',
    symbol: '',
    description: '',
    imageURI: '',
    twitterLink: '',
    discordLink: '',
    websiteLink: '',
  })
  const { address } = useWalletContext()
  const [features, setFeatures] = useState<Feature[]>([])

  const fetchFeatures = async (visible?: boolean) => {
    const features = await getFeatures(visible)
    if (features) {
      setFeatures(features)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchFeatures()
    }
    fetchData()
  }, [])

  const callUpdateFeatures = async (updatedFeatures: Feature[]) => {
    await updateFeatures(updatedFeatures, address)
    setFeatures(updatedFeatures)
  }

  const handleSaveChanges = async (updatedFeatures: Feature[]) => {
    try {
      await callUpdateFeatures(updatedFeatures)

      toast.showSuccessToast('Features updated successfully')
    } catch (error) {
      await generateJwt(address)
      await callUpdateFeatures(updatedFeatures)
    }
  }

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isLoading])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { res, err: doginalCollectionErr } = await createDoginalCollection(formData, address)

    if (doginalCollectionErr) {
      await generateJwt(address)
      const { res, err } = await createDoginalCollection(formData, address)

      if (err) {
        throw new Error(`Unable to create doginal collection: ${err.message}`)
      }
    }
  }

  const [jsonInputType, setJsonInputType] = useState<'file' | 'text'>('file') // Track the JSON input type
  const [jsonFileData, setJsonFileData] = useState<string>('') // Store JSON file data
  const [jsonTextInput, setJsonTextInput] = useState<string>('') // Store JSON text input

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleJsonFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setJsonFileData(event.target.result)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleJsonSubmit = async () => {
    let jsonData: DoginalsCollectionData

    if (jsonInputType === 'file') {
      jsonData = JSON.parse(jsonFileData)
    } else {
      jsonData = JSON.parse(jsonTextInput)
    }

    try {
      await createDoginal(jsonData, address)
    } catch (e) {
      await generateJwt(address)
      await createDoginal(jsonData, address)
    }
  }

  const [showFeatureManager, setShowFeatureManager] = useState<boolean>(false)

  const onChange = () => {
    setShowFeatureManager(!showFeatureManager)
  }

  return (
    <PageBase>
      {isLoading && <LoadingView isFixed={true} />}
      <CustomToastContainer />
      <ToggleSwitch onChange={onChange} />
      {!showFeatureManager ? (
        <form
          onSubmit={async (e) => {
            setIsLoading(true)
            try {
              await handleSubmit(e)
              toast.showSuccessToast('Successfully created collection')
              setFormData({
                name: '',
                symbol: '',
                description: '',
                imageURI: '',
                twitterLink: '',
                discordLink: '',
                websiteLink: '',
              })
            } catch (e) {
              if (e instanceof Error) {
                console.log(e.message)
                toast.showErrorToast(e.message)
              }
            }
            setIsLoading(false)
          }}
          className="flex justify-center pb-12"
        >
          <div className="flex flex-col items-center w-1/2">
            <InputField
              label="Name"
              name="name"
              placeholder="Enter collection name"
              value={formData.name}
              onChange={handleChange}
            />
            <InputField
              label="Symbol"
              name="symbol"
              placeholder="Enter collection symbol"
              value={formData.symbol}
              onChange={handleChange}
            />
            <InputField
              label="Description"
              name="description"
              placeholder="Enter collection description"
              value={formData.description}
              onChange={handleChange}
            />
            <InputField
              label="Image URI"
              name="imageURI"
              placeholder="Enter collection image URI"
              value={formData.imageURI}
              onChange={handleChange}
            />
            <InputField
              label="Twitter Link"
              name="twitterLink"
              placeholder="Enter Twitter link"
              value={formData.twitterLink}
              onChange={handleChange}
            />
            <InputField
              label="Discord Link"
              name="discordLink"
              placeholder="Enter Discord link"
              value={formData.discordLink}
              onChange={handleChange}
            />
            <InputField
              label="Website Link"
              name="websiteLink"
              placeholder="Enter website link"
              value={formData.websiteLink}
              onChange={handleChange}
            />
            <button type="submit" className="rounded-lg border w-56">
              Create Collection
            </button>
          </div>
          <div className="w-1/2 flex flex-col gap-y-4">
            <div>
              <label>Select JSON Input Type:</label>
              <div>
                <input
                  type="radio"
                  name="jsonInputType"
                  value="file"
                  checked={jsonInputType === 'file'}
                  onChange={() => setJsonInputType('file')}
                />
                <label>Upload JSON File</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="jsonInputType"
                  value="text"
                  checked={jsonInputType === 'text'}
                  onChange={() => setJsonInputType('text')}
                />
                <label>Paste JSON Text</label>
              </div>
            </div>
            {jsonInputType === 'file' ? (
              <div>
                <label>Upload JSON File</label>
                <input type="file" accept=".json" onChange={handleJsonFileChange} />
              </div>
            ) : (
              <div>
                <label>Paste JSON Text</label>
                <textarea
                  value={jsonTextInput}
                  onChange={(e) => setJsonTextInput(e.target.value)}
                  placeholder="Enter JSON data here..."
                  className="block p-2.5 w-full text-sm bg-account-page-background rounded-lg border border-gray-300 focus:ring-offset-selected-color focus:border-selected-color"
                  rows={20}
                />
              </div>
            )}
            <BaseButton
              onClick={async () => {
                setIsLoading(true)
                try {
                  await handleJsonSubmit()
                  setJsonFileData('')
                  setJsonTextInput('')

                  toast.showSuccessToast('Collection data successfully uploaded')
                } catch (e) {
                  if (e instanceof Error) {
                    toast.showErrorToast(`Collection data upload failed: ${e.message}`)
                  }
                }
                setIsLoading(false)
              }}
              disabled={
                isLoading || (jsonInputType === 'file' && !jsonFileData) || (jsonInputType === 'text' && !jsonTextInput)
              }
            >
              Submit JSON Data
            </BaseButton>
          </div>
        </form>
      ) : (
        <div>
          <FeaturesManager features={features} onSaveChanges={handleSaveChanges} />
          <CreateFeatureForm />
        </div>
      )}
    </PageBase>
  )
}

export default CreateCollectionForm
