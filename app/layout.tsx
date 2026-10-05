import type {Metadata, Viewport} from 'next';
import './globals.css';
import './automotive.css';
import './hp.css';

export const metadata: Metadata = {
  title: {default: 'HP-Automotive — De juiste wagen. Zonder omweg.', template: '%s | HP-Automotive'},
  description: 'Ontdek de wagens van HP-Automotive of verkoop uw wagen. Foto’s, video en heldere voertuiggegevens — in het Nederlands, Frans en Engels.',
  icons: {icon: '/favicon.svg'},
};

export const viewport: Viewport = {themeColor: '#060709', colorScheme: 'dark light'};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang="nl-BE" suppressHydrationWarning>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=Inter:wght@400;500;600&display=swap"/>
    </head>
    <body>
      <script dangerouslySetInnerHTML={{__html: "document.documentElement.classList.add('hp-js')"}}/>
      {children}
    </body>
  </html>;
}
