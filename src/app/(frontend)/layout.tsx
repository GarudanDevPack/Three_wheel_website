import type { Metadata } from "next";
import "../../styles/tailwind.css";

export const metadata: Metadata = {
  title: "Neptune Three-Wheelers",
  description: "Neptune three-wheeler auto rickshaws — built for daily loads and longer routes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body id='scrool'>
        {children}
      </body>
    </html>
  );
}
