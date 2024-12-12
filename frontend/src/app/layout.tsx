import "./globals.css";

import { getGlobalData, getGlobalPageMetadata } from "@/data/loaders";

import { DataProvider } from "@/components/custom/dataWrapper/dataWrapper";
import { Footer } from "@/components/custom/Footer";
import { Header } from "@/components/custom/Header";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";

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

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getGlobalPageMetadata();
  const { title, description } = metadata;

  return {
    title: title || "Intellect",
    description: description || "Intellectual League",
  };
}
const headerDataDefault = {
  
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalData = await getGlobalData();
  const { blocks } = globalData;
  
  if(!blocks){
    
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  min-h-screen  grid grid-rows-[auto_1fr_auto]`}
      >
        <Toaster position="bottom-center" />
          <Header data={blocks[0]}/>
        <DataProvider>
          <main className=" w-full my-2">{children}</main>
        </DataProvider>
          <Footer data={blocks[1]}/>
      </body>
    </html>
  );
}
