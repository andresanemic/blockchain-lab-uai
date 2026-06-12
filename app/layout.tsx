import type { Metadata } from 'next'
import { Roboto, JetBrains_Mono, Ubuntu, Cantarell } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/v2/LenisProvider'

// Body copy — Roboto: the paradigmatic digital-UI / Material / Chrome OS font
const roboto = Roboto({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500'],
  preload: false,
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  preload: false,
})

// Display / headlines — Ubuntu: canonical Linux desktop typeface, geometric & technical
const ubuntu = Ubuntu({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  preload: false,
})

// UI labels / CTA text — Cantarell: GNOME/KDE-associated system UI font
const cantarell = Cantarell({
  variable: '--font-oswald',
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: false,
})

export const metadata: Metadata = {
  title: 'Blockchain Lab UAI — Innovación Descentralizada',
  description:
    'Laboratorio de innovación blockchain de la Universidad Adolfo Ibáñez. Soluciones en DeFi, gobernanza digital, tokenización y smart contracts para empresas e instituciones.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${roboto.variable} ${jetbrainsMono.variable} ${ubuntu.variable} ${cantarell.variable} antialiased`}
    >
      <body className="min-h-screen"><LenisProvider>{children}</LenisProvider></body>
    </html>
  )
}
