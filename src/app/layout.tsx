import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Using generic names for now, relying on variable integration
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { DataProvider } from "@/context/data-context";
import { NotificationProvider } from "@/context/notification-context";
import { LumosAssistant } from "@/components/ai/lumos-assistant";
import { ToastProvider } from "@/components/ui/toast-provider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-geist-mono", // Using outfit as display font
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumos | Campus Placement OS",
  description: "The top 1% placement experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('lumos-theme') || 'dark';
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        <ToastProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
              storageKey="lumos-theme"
            >
              <NotificationProvider>
                <DataProvider>
                  {children}
                  <LumosAssistant />
                </DataProvider>
              </NotificationProvider>
            </ThemeProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
