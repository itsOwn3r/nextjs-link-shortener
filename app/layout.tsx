import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "@/app/globals.css";

const oswald = localFont({ src: "../public/fonts/Oswald-SemiBold.ttf" });

export const metadata: Metadata = {
  title: "Link Shortener",
  description: "Link Shortener By Own3r",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{colorScheme: "dark"}}>
      <body className={oswald.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
