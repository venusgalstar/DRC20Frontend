import { GlobalOutlined, TwitterOutlined } from '@ant-design/icons'
import React from 'react'

import InfoPopover from './InfoPopover'

const ServiceContentContainer = ({
  children,
  title,
  header,
  description,
  maxWidth = '480px',
  minHeight = '480px',
  imgTag,
  showTitleBorder = true,
  info = '',
  websiteLink = '',
  twitterLink = '',
  highlightColor = '#feb628',
}: {
  children: any
  title?: string
  header?: any
  description?: string
  maxWidth?: string
  minHeight?: string
  imgTag?: React.ReactElement
  showTitleBorder?: boolean
  info?: string
  websiteLink?: string
  twitterLink?: string
  highlightColor?: string
}) => {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#01ffe1',
        border: '2px solid #f5f5f5',
        borderRadius: '0px',
        margin: 'auto',
        marginBottom: '84px',
        maxWidth: maxWidth,
        height: minHeight,
        width: '100%',
      }}
    >
      {imgTag && (
        <div
          style={{
            padding: '18px 0px 0px 0px',
          }}
        >
          {imgTag}
        </div>
      )}
      {title && title.length > 0 && (
        <div
          style={{
            borderBottom: showTitleBorder ? '2px solid #f5f5f5' : 'none',
            textAlign: 'left',
            padding: '16px 16px',
            paddingTop: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  paddingBottom: '8px',
                }}
              >
                {title}
              </span>
              <InfoPopover
                content={info}
                style={{
                  position: 'relative',
                  top: '-5px',
                  color: highlightColor,
                  border: `2px solid ${highlightColor}`,
                }}
              />
            </div>
            <div className="text-xl">
              {websiteLink && (
                <a href={websiteLink} target="_blank" rel="noreferrer" style={{ padding: '0 8px' }}>
                  <GlobalOutlined />
                </a>
              )}
              {twitterLink && (
                <a href={twitterLink} target="_blank" rel="noreferrer" style={{ padding: '0 8px' }}>
                  <TwitterOutlined />
                </a>
              )}
            </div>
          </div>
          {description && description.length > 0 && (
            <span
              style={{
                display: 'block',
                fontSize: '0.8em',
              }}
            >
              {description}
            </span>
          )}
        </div>
      )}
      {header && (
        <div
          style={{
            borderBottom: showTitleBorder ? '2px solid #f5f5f5' : 'none',
            textAlign: 'left',
            padding: '24px 32px',
          }}
        >
          {' '}
          {header}
        </div>
      )}

      {children !== null && (
        <div
          style={{
            padding: '16px',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default ServiceContentContainer
