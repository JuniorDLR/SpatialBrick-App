import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "BFA | Bateria Factorial de Aptitudes",
  description: "Aplicacion frontend para evaluacion psicometrica BFA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-brand-light text-slate-800 antialiased transition-colors duration-300 ease-in-out dark:bg-brand-dark dark:text-brand-silver">
        <ThemeProvider>
          <div className="fixed right-5 top-5 z-50">
            <ThemeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
