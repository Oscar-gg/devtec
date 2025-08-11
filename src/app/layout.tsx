import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "DevTec - Browse Community Projects",
  description:
    "Discover projects, developers, and organizations related to the Tec community. Explore projects to contribute or use!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body className="bg-[#121212] text-[#E0E0E0]">
        <SessionProvider>
          <Header />

          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
