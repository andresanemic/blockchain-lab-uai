import NavV2        from '@/components/v2/NavV2'
import HeroV2       from '@/components/v2/HeroV2'
import AboutV2      from '@/components/v2/AboutV2'
import BlockchainV2 from '@/components/v2/BlockchainV2'
import AreasV2      from '@/components/v2/AreasV2'
import ProjectsV2   from '@/components/v2/ProjectsV2'
import ProcessV2    from '@/components/v2/ProcessV2'
import ImpactV2     from '@/components/v2/ImpactV2'
import TeamV2       from '@/components/v2/TeamV2'
import FooterV2     from '@/components/v2/FooterV2'
import ScrollUI     from '@/components/v2/ScrollUI'

export default function Page() {
  return (
    <>
      <ScrollUI />
      <NavV2 />
      <main>
        <HeroV2 />
        <AboutV2 />
        <BlockchainV2 />
        <ProjectsV2 />
        <AreasV2 />
        <ProcessV2 />
        <ImpactV2 />
        <TeamV2 />
      </main>
      <FooterV2 />
    </>
  )
}
