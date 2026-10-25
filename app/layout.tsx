import { Geist, Geist_Mono, Montserrat } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import TanstackProvider from "@/provider/tanstack-provider";
import { Toaster } from "sonner";
import RecruiterAuthGuard from "@/components/auth/RecruiterAuthGuard";

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", montserrat.variable)}
    >
      <body>
        {/* <RecruiterAuthGuard> */}

        <ThemeProvider>
          <TanstackProvider>

            {children}

            <Toaster position="bottom-right" duration={3000} richColors />
            <ReactQueryDevtools />

          </TanstackProvider>
        </ThemeProvider>

        {/* </RecruiterAuthGuard> */}


      </body>
    </html>
  )
}
