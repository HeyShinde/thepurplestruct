import {
  Chakra_Petch,
  Fira_Code,
  IBM_Plex_Mono,
  Rubik_Glitch,
} from "next/font/google"

import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"
import Script from "next/script"

import { SpeedInsights } from "@vercel/speed-insights/next"

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
  title: "The Purple Struct",
  description: "Visual tech tutorials on data structures, ML, and systems by Shinde Aditya."
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
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="The Purple Struct Blog RSS Feed"
          href="https://www.thepurplestruct.com/rss.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="The Purple Struct Blog Atom Feed"
          href="https://www.thepurplestruct.com/atom.xml"
        />
        <link
          rel="alternate"
          type="application/json"
          title="The Purple Struct Blog JSON Feed"
          href="https://www.thepurplestruct.com/feed.json"
        />
      </head>
      <body className="antialiased bg-zinc-900 text-white" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RRNDHMT5BP"
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RRNDHMT5BP');
          `}
        </Script>
        {/* Google Tag Manager */}
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GT-PJ5RLN2D"
          strategy="lazyOnload"
        />
        <SpeedInsights/>
      </body>
    </html>
  )
}
