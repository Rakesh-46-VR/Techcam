import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/footer";
import { UserProvider } from '@auth0/nextjs-auth0/client';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechCam",
  description: "Tech Chronicals - By TechCam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <UserProvider>
        <body className={inter.className}>
          <Navbar />
          {children}
          {/* <Footer /> */}
          {/* <script src="https://cdn.botpress.cloud/webchat/v1/inject.js"></script>
          <script src="https://mediafiles.botpress.cloud/77084006-7f96-4d9e-b5a6-acb3c91fe868/webchat/config.js" defer></script> */}
          <script src="https://cdn.botpress.cloud/webchat/v1/inject.js"></script>
          <script src="https://mediafiles.botpress.cloud/77084006-7f96-4d9e-b5a6-acb3c91fe868/webchat/config.js" defer></script>
        </body>
       </UserProvider>
    </html>
  );
}
