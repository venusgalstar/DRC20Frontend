import { useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'

import { truncateAddress, truncateInscriptionId } from '@/utils'

type DetailsAccordionProps = {
  inscriptionId: string
  owner: string
  content: string
  createdAt: string
}

const DetailsAccordion = ({ inscriptionId, owner, content, createdAt }: DetailsAccordionProps) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border-2 border-account-page-background rounded-lg mb-2 w-full">
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
              <td>
                <a href={`https://wonky-ord.dogeord.io/shibescription/${inscriptionId}`} target="_blank">
                  {truncateInscriptionId(inscriptionId)}
                </a>
              </td>
            </tr>
            <tr>
              <td>Owner</td>
              <td>
                <a href={`/account/${owner}`} target="_blank">
                  {truncateAddress(owner)}
                </a>
              </td>
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
                  new Intl.DateTimeFormat('en-GB', {
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

export default DetailsAccordion
