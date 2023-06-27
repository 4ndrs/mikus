import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mikus",
  description: "Mikus mikus mikus",
  themeColor: "rgb(17 24 39)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className + " min-h-screen bg-gray-900 text-slate-300"}
      >
        {children}
      </body>
    </html>
  );
}
