import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Lato, Oswald } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '800'],
  preload: false,
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  preload: false,
})

// Brochure primary display font — all major headlines
const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  preload: false,
})

// Brochure label font — eyebrows & uppercase section tags
const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
      className={`${inter.variable} ${jetbrainsMono.variable} ${lato.variable} ${oswald.variable} antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
