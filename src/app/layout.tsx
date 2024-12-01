import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import localFont from 'next/font/local'

const roboto = localFont({
  src: [
    {
      path: '../app/fonts/Roboto-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../app/fonts/Roboto-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../app/fonts/Roboto-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-roboto'
})

export const metadata = {
  title: "Restaurant Template",
  description: "Restaurant Template using Medusa",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
