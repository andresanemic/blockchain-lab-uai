import type { Metadata } from 'next'
import NavV2           from '@/components/v2/NavV2'
import FooterV2        from '@/components/v2/FooterV2'
import ScrollUI        from '@/components/v2/ScrollUI'
import CertHeroV2      from '@/components/v2/CertHeroV2'
import CertDemoV2      from '@/components/v2/CertDemoV2'
import CertAboutV2     from '@/components/v2/CertAboutV2'
import CertLabV2       from '@/components/v2/CertLabV2'
import CertResultadoV2 from '@/components/v2/CertResultadoV2'

export const metadata: Metadata = {
  title: 'Certificados — Blockchain Lab UAI',
  description: 'Sistema de emisión y verificación de certificados en blockchain. Criptográficamente verificables, imposibles de falsificar.',
}

export default function CertificadosPage() {
  return (
    <>
      <ScrollUI />
      <NavV2 />
      <main>
        <CertHeroV2 />
        <CertDemoV2 />
        <CertAboutV2 />
        <CertLabV2 />
        <CertResultadoV2 />
      </main>
      <FooterV2 />
    </>
  )
}
