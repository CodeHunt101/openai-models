import '@/styles/globals.css';
import Providers from './providers';
import Layout from '@/components/Layout';

export const metadata = {
  title: 'OpenAI GPT Models',
  description: 'Chat with OpenAI GPT models',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
