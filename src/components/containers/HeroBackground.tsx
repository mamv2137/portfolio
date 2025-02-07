import * as React from "react"
import { AuroraBackground } from '../ui/aurora-background'

const HeroBackground = ({ children }: React.PropsWithChildren) => {
  return (
    <AuroraBackground>
      {children}
    </AuroraBackground>
  )
}

export default HeroBackground