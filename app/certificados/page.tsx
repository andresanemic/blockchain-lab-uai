import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CertHero from '@/components/certificados/CertHero'
import CertProblem from '@/components/certificados/CertProblem'
import CertSolution from '@/components/certificados/CertSolution'
import CertBenefits from '@/components/certificados/CertBenefits'
import CertDemo from '@/components/certificados/CertDemo'
import CertCTA from '@/components/certificados/CertCTA'

export const metadata: Metadata = {
  title: 'Certificados Digitales — Blockchain Lab UAI',
  description:
    'Sistema de emisión y verificación de títulos universitarios en blockchain. Criptográficamente verificables, imposibles de falsificar.',
}

export default function CertificadosPage() {
  return (
    <>
      <Nav />
      <main>
        <CertHero />
        <CertProblem />
        <CertSolution />
        <CertBenefits />
        <CertDemo />
        <CertCTA />
      </main>
      <Footer />
    </>
  )
}
