import { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'

import { truncateAddress, truncateInscriptionId } from '@/utils'

type DoginalDetailsProps = {
  inscriptionId: string
  owner: string
  content: string
  createdAt: string
}

const DoginalDetails = ({ inscriptionId, owner, content, createdAt }: DoginalDetailsProps) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border-2 border-account-page-background bg-white rounded-lg mb-2">
      <button
        className="w-full text-left px-3 py-2 rounded flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-2">
          <img src="/details-accordion-logo.svg" alt="details" className="w-4"></img>
          <span className="font-semibold">Details</span>
        </div>
        <span className="focus:outline-none">{isOpen ? <FaAngleDown /> : <FaAngleUp />}</span>
      </button>
      {isOpen && (
        <div className="border-t-2 border-account-page-background py-2 lg:py-[10px] px-3 xxs:text-xxxs xs:text-xs md:text-sm">
          <table className="w-full [&>tr>*:nth-child(1)]:w-[40%] [&>tr>*:nth-child(1)]:text-left [&>tr>*:nth-child(2)]:font-semibold [&>tr>*:nth-child(2)]:w-[60%] [&>tr>*:nth-child(2)]:text-right leading-6">
            <tr>
              <td>Inscription ID</td>
              <td>{truncateInscriptionId(inscriptionId)}</td>
            </tr>
            <tr>
              <td>Owner</td>
              <td>{truncateAddress(owner)}</td>
            </tr>
            <tr>
              <td>Content</td>
              <td>
                <a href={content} target="_blank">
                  Link
                </a>
              </td>
            </tr>
            <tr>
              <td>Created</td>
              <td>
                {createdAt &&
                  createdAt.length > 0 &&
                  new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: false,
                    timeZone: 'UTC',
                  }).format(new Date(createdAt))}{' '}
                (UTC)
              </td>
            </tr>
          </table>
        </div>
      )}
    </div>
  )
}

export default DoginalDetails
