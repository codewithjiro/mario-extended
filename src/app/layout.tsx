import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "~/components/ui/sonner";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

export const metadata: Metadata = {
  title: "Mario Extended App",
  description: "An extended version of the Mario app with authentication",
  icons: [{ rel: "icon", url: "/logo.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <body>
      <ClerkProvider
        afterSignInUrl="/dashboard"
        afterSignOutUrl="/"
        appearance={{
          baseTheme: dark,
        }}
      >
        <html lang="en" className={`${geist.variable}`}>
          <body>
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            {children}
          </body>
        </html>
      </ClerkProvider>
      <Toaster richColors position="bottom-right" />
    </body>
  );
}
