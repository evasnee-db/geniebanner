import type { Metadata } from "next";
import "./globals.css";
import { AppPasswordGate } from "@/components/AppPasswordGate";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Databricks Designer Starter Kit",
  description: "DuBois-themed shadcn/ui components for building Databricks UIs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <AppPasswordGate>{children}</AppPasswordGate>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
