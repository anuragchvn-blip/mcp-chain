import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'ChainMind - Multi-Chain Blockchain Dashboard',
  description: 'Real-time blockchain operations with AI-powered MCP server',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
