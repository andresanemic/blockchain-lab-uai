import type { Metadata } from 'next'
import NavV2            from '@/components/v2/NavV2'
import FooterV2         from '@/components/v2/FooterV2'
import ScrollUI         from '@/components/v2/ScrollUI'
import VideoHeroV2      from '@/components/v2/VideoHeroV2'
import VideoAboutV2     from '@/components/v2/VideoAboutV2'
import VideoLabV2       from '@/components/v2/VideoLabV2'
import VideoResultadoV2 from '@/components/v2/VideoResultadoV2'

export const metadata: Metadata = {
  title: 'Validación de Videos — Blockchain Lab UAI',
  description: 'Protocolo RUC-D: transmisión en vivo, hash SHA-256 y blockchain para transformar grabaciones de dron en evidencia judicial técnica y procesalmente irrefutable.',
}

export default function ValidacionVideosPage() {
  return (
    <>
      <ScrollUI />
      <NavV2 />
      <main>
        <VideoHeroV2 />
        <VideoAboutV2 />
        <VideoLabV2 />
        <VideoResultadoV2 />
      </main>
      <FooterV2 />
    </>
  )
}
