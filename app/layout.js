import './globals.css'

export const metadata = {
  title: 'MFLavado · Business Intelligence & Strategy',
  description: 'Consultoría ejecutiva, insights de negocio y recursos para líderes que transforman datos en decisiones.',
  keywords: 'business intelligence, estrategia, consultoría ejecutiva, análisis de datos, Barcelona',
  openGraph: {
    title: 'MFLavado · Business Intelligence & Strategy',
    description: 'Insights, análisis y recursos para líderes ejecutivos.',
    url: 'https://mflavado.com',
    siteName: 'MFLavado',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MFLavado',
    description: 'Business Intelligence & Strategy',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://mflavado.com',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
