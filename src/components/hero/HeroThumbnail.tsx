const HeroThumbnail = ({ imageURI, name }: { imageURI: string; name: string }) => {
  return <img src={imageURI} alt={name} className="rounded-xl md:h-64 md:w-64 w-full h-48 object-cover object-center" />
}

export default HeroThumbnail
