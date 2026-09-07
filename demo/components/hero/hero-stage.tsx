import { Container } from '../container'
import { HeroText } from './hero-text'
import { HeroTape } from './hero-tape'

export function HeroStage() {
  return (
    <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(207,36,54,0.05),transparent_62%)] pt-8 sm:pt-12">
      <Container className="max-w-[1100px]">
        <HeroText />
      </Container>
      <HeroTape />
    </div>
  )
}
