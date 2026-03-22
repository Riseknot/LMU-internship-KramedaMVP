import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./src/index.css";

export const metadata: Metadata = {
  title: "Lumi",
  description: "Die Helfer-App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
