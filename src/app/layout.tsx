import {
  Chakra_Petch,
  Fira_Code,
  IBM_Plex_Mono,
  Rubik_Glitch,
} from "next/font/google"

import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra-petch",
  display: "swap",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  preload: true,
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-fira-code",
  display: "swap",
})

const rubikGlitch = Rubik_Glitch({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rubik-glitch",
  display: "swap",
})

export const metadata: Metadata = {
  title: "HeyShinde",
  description: "Learn from the best",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${chakraPetch.variable} ${ibmPlexMono.variable} ${firaCode.variable} ${rubikGlitch.variable}`}
    >
      <body className="antialiased bg-zinc-900 text-white" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
