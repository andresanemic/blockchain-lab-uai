import CursorV2     from '@/components/v2/CursorV2'
import NavV2        from '@/components/v2/NavV2'
import HeroV2       from '@/components/v2/HeroV2'
import MarqueeV2    from '@/components/v2/MarqueeV2'
import AboutV2      from '@/components/v2/AboutV2'
import BlockchainV2 from '@/components/v2/BlockchainV2'
import AreasV2      from '@/components/v2/AreasV2'
import ProjectsV2   from '@/components/v2/ProjectsV2'
import ProcessV2    from '@/components/v2/ProcessV2'
import ImpactV2     from '@/components/v2/ImpactV2'
import RoadmapV2    from '@/components/v2/RoadmapV2'
import TeamV2       from '@/components/v2/TeamV2'
import ContactV2    from '@/components/v2/ContactV2'
import FooterV2     from '@/components/v2/FooterV2'

export default function Page() {
  return (
    <>
      <CursorV2 />
      <NavV2 />
      <main>
        <HeroV2 />
        <MarqueeV2 />
        <AboutV2 />
        <BlockchainV2 />
        <MarqueeV2 dark />
        <AreasV2 />
        <ProjectsV2 />
        <ProcessV2 />
        <ImpactV2 />
        <RoadmapV2 />
        <TeamV2 />
        <ContactV2 />
      </main>
      <FooterV2 />
    </>
  )
}
