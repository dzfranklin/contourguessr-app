import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import classNames from "@/classNames";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ContourGuessr",
  description:
    "Guess where a photo was taken with the help of a topographic map",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={classNames(inter.className, "h-full")}>
        <Toaster position="bottom-center" />
        {children}
      </body>
    </html>
  );
}
