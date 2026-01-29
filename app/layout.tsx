import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { AppShell } from "@/components/app-shell"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import { FacebookPixel } from "@/components/facebook-pixel"
import { TestModeProvider } from "@/components/test-mode-provider"
import { FloatingTestControls } from "@/components/floating-test-controls"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Meta Tracking Lab - Debug & Validate Events",
  description: "Interactive tracking documentation for Meta Pixel and Conversions API debugging",
  verification: {
    other: {
      "facebook-domain-verification": "xcmf2wphzfi13atfjld5dyv2o6uzp6",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
        <FacebookPixel />
        <ThemeProvider
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TestModeProvider>
            <AppShell>
              {children}
              <FloatingTestControls />
            </AppShell>
            <Toaster />
          </TestModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
