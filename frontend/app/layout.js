import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', 
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {}
      <body>
        <div className={`${inter.variable} font-sans antialiased bg-gray-900 text-gray-100`}>
          {children}
        </div>
      </body>
    </html>
  );
}
