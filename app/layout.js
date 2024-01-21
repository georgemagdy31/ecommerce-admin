"use client"
import Layout from '@/components/layout'
import './globals.css'
import { SessionProvider } from "next-auth/react"
import { Inter } from 'next/font/google'
import "@uploadthing/react/styles.css";
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })
export default function RootLayout({ children }) {
  
  return (
    <html lang="en" className={inter.className}>
      
      <body >
        <SessionProvider >
      {children}
      </SessionProvider>
      </body>
    </html>
  )
}
