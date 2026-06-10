import CursorV2 from '@/components/v2/CursorV2'
import NavV2 from '@/components/v2/NavV2'
import HeroV2 from '@/components/v2/HeroV2'
import StatementV2 from '@/components/v2/StatementV2'
import AreasV2 from '@/components/v2/AreasV2'
import ProjectsV2 from '@/components/v2/ProjectsV2'
import TeamV2 from '@/components/v2/TeamV2'
import ContactV2 from '@/components/v2/ContactV2'
import FooterV2 from '@/components/v2/FooterV2'

export default function Page() {
  return (
    <>
      <CursorV2 />
      <NavV2 />
      <main>
        <HeroV2 />
        <StatementV2 />
        <AreasV2 />
        <ProjectsV2 />
        <TeamV2 />
        <ContactV2 />
      </main>
      <FooterV2 />
    </>
  )
}
