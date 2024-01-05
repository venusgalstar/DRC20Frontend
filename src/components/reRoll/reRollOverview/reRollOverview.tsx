import cn from 'classnames'
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Slider from 'react-slick'

import { LabradogeSelectionModal } from '@/components/reRoll/labradogeSelectionModal/labradogeSelectionModal'
import { TennisBallsSelectionModal } from '@/components/reRoll/tennisBallsSelectionModal/tennisBallsSelectionModal'
import ServiceContentContainer from '@/components/ServiceContentContainer'
import { CustomButton, Text } from '@/components/ui'
import { ImageWrapper } from '@/components/ui/imageWrapper'
import { useReRollData } from '@/hooks/useReRollData'

import styles from './reRollOverview.module.scss'

export function ReRollOverview() {
  const {
    isReRollButtonDisabled,
    tennisBallsAmount,
    labradogeAmount,
    selectedLabradoge,
    selectedTennisBalls,
    tennisBallsNeeded,
    setIsModalOpen,
    onReRoll,
    onClickSelect,
    slider,
  } = useReRollData()

  const sliderSettings = useMemo(
    () => ({
      arrows: false,
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }),
    []
  )
  return (
    <>
      <ServiceContentContainer>
        <Slider ref={slider} {...sliderSettings}>
          <div className={styles.container}>
            <ImageWrapper
              onClickImage={() => setIsModalOpen('labradoge')}
              imgPlaceholder={
                !selectedLabradoge?.image ? (
                  <div
                    className={styles.imgPlaceholder}
                    onClick={() => {
                      setIsModalOpen('labradoge')
                    }}
                  >
                    <Text size="xl" fontWeight="extraBold">
                      +
                    </Text>
                  </div>
                ) : undefined
              }
              src={selectedLabradoge ? selectedLabradoge.image : undefined}
              size="big"
            />
            <Text className={styles.headline} size="xl" fontWeight="extraBold">
              Select your Labradoge to re-roll
            </Text>
            <div className={styles.textContainer}>
              <Text color="dark-grey" className={styles.reRollText} size="md">
                Labradoge in wallet:&nbsp;
              </Text>
              <Text className={styles.reRollAmount} size="md" color="dark-grey">
                {labradogeAmount}
              </Text>
            </div>
            <CustomButton
              isDisabled={!selectedLabradoge}
              className={styles.button}
              onClick={onClickSelect}
              label="Select"
            />
          </div>
          <div className={styles.container}>
            <div>
              <ServiceContentContainer>
                <div className={styles.tennisBallSelectionContainer}>
                  {Array(tennisBallsNeeded)
                    .fill({})
                    .map((_, index) => (
                      <ImageWrapper
                        onClickImage={() => setIsModalOpen('tennisBalls')}
                        key={`tennis ball image ${index}`}
                        imgPlaceholder={
                          !selectedTennisBalls?.[index]?.imageSrc ? (
                            <div
                              className={styles.smallImgPlaceholder}
                              onClick={() => {
                                setIsModalOpen('tennisBalls')
                              }}
                            >
                              <Text size="xl" fontWeight="extraBold">
                                +
                              </Text>
                            </div>
                          ) : undefined
                        }
                        src={selectedTennisBalls?.[index] ? selectedTennisBalls?.[index]?.imageSrc : undefined}
                        size="small"
                      />
                    ))}
                </div>
              </ServiceContentContainer>
              <Text className={styles.headline} size="xl" fontWeight="extraBold">
                Throw{' '}
                <Text as="span" className={styles.underline} size="xl" fontWeight="extraBold">
                  {tennisBallsNeeded}
                </Text>{' '}
                tennis ball(s) to attract your new Labradoge
              </Text>
              <div className={styles.textContainer}>
                <Text color="dark-grey" className={styles.reRollText} size="md">
                  Tennis Balls in wallet:&nbsp;
                </Text>
                <Text className={styles.reRollAmount} size="md" color="dark-grey">
                  {tennisBallsAmount}
                </Text>
              </div>
            </div>
            {tennisBallsAmount < tennisBallsNeeded ? (
              <Text size="xl" color="red" fontWeight="normal" className={cn(styles.tennisBallButton, styles.errorText)}>
                Not enough tennis balls, get some <a href="/service/tennis-balls">here</a>.
              </Text>
            ) : null}
            <CustomButton
              isDisabled={isReRollButtonDisabled}
              className={cn(styles.button, { [styles.tennisBallButton]: tennisBallsAmount >= tennisBallsNeeded })}
              onClick={onReRoll}
              label="Re-roll"
            />
            <Text size="md" className={styles.disclaimer}>
              By clicking “Re-roll”, you agree to burn your current Labradoge art incl. the needed amount of Tennis ball
              NFTs and agree to the <a href="/legal/terms">Terms of Use</a>.
            </Text>
          </div>
        </Slider>
      </ServiceContentContainer>
      <LabradogeSelectionModal />
      <TennisBallsSelectionModal />
    </>
  )
}
