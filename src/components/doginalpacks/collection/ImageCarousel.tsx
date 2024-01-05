import React from 'react'
import Slider from 'react-slick'

import './ImageCarousel.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface ImageCarouselProps {
  images: string[]
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    arrows: true,
    className: 'bg-gray-100',
    responsive: [
      {
        breakpoint: 1024, // md
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768, // sm
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // xs
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div>
      <p></p>
      <Slider {...settings}>
        {images.map((img, index) => (
          <div className="px-5 pt-5 pb-4" key={index}>
            <img src={img} alt={`carousel-img-${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default ImageCarousel
