import type { Metadata } from "next"
import { DM_Mono } from "next/font/google"
import "./globals.css"

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
})

export const metadata: Metadata = {
  title: "AntiSocial",
  description: "Local only posting app with expiring posts",
  keywords: ["social", "media", "post", "expiring", "local"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmMono.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-900 text-neutral-500">
        {children}
      </body>
    </html>
  )
}
