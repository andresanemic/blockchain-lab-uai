import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ValidHero from '@/components/validacion/ValidHero'
import ValidProblem from '@/components/validacion/ValidProblem'
import ValidArchitecture from '@/components/validacion/ValidArchitecture'
import ValidActors from '@/components/validacion/ValidActors'
import ValidFlow from '@/components/validacion/ValidFlow'
import ValidCTA from '@/components/validacion/ValidCTA'

export const metadata: Metadata = {
  title: 'Validación de Pruebas Multimedia — Blockchain Lab UAI',
  description:
    'Protocolo RUC-D: sistema Web2 + Web3 para validar grabaciones de dron como prueba judicial irrefutable en la industria forestal chilena.',
}

export default function ValidacionPage() {
  return (
    <>
      <Nav />
      <main>
        <ValidHero />
        <ValidProblem />
        <ValidArchitecture />
        <ValidActors />
        <ValidFlow />
        <ValidCTA />
      </main>
      <Footer />
    </>
  )
}
