import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface AvatarWrapperInterface { src: string, alt: string, fallbackText?: string }

const AvatarWrapper = ({ src, alt, fallbackText }: AvatarWrapperInterface) => {
  return (
    <Avatar>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{fallbackText ?? alt}</AvatarFallback>
    </Avatar>
  )
}

export default AvatarWrapper