import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";

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
    <ClerkProvider
      afterSignInUrl="/dashboard"
      afterSignOutUrl="/"
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" className={`${geist.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
