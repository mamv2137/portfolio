import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface AvatarWrapperInterface { src: string, alt: string, fallbackText?: string }

const AvatarWrapper = ({ src, alt, fallbackText }: AvatarWrapperInterface) => {
  return (
    <Avatar className='w-40 h-10/12'>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{fallbackText ?? alt}</AvatarFallback>
    </Avatar>
  )
}

export default AvatarWrapper