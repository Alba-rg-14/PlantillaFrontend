import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./layoutCliente"; // Manejo de SessionProvider

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

//Cambiar texto AQUI
export const metadata: Metadata = {
  title: "Mi App",
  description: "Aplicación personalizada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* Renderizamos el layout sin un navbar adicional */}
          <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Aquí queda tu navbar actual */}
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
