import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { InventoryProvider } from '../context/InventoryContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ApiKeyProvider } from '../context/ApiKeyContext';

export const metadata: Metadata = {
  title: 'AushadhiSetu | National Medicine Stock-out Prevention Platform',
  description: 'AI-driven stock-out prevention and intelligent inter-PHC medicine redistribution for India\'s public healthcare network.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <body className="min-h-full flex flex-col font-sans text-slate-900 bg-slate-50 selection:bg-blue-600 selection:text-white">
        <LanguageProvider>
          <AuthProvider>
            <InventoryProvider>
              <ApiKeyProvider>
                {children}
              </ApiKeyProvider>
            </InventoryProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
