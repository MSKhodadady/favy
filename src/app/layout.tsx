import { Vazirmatn } from "next/font/google";
import { ReactNode } from "react";

import { Metadata } from "next";
import "../styles/globals.css";
import { AppWrapper } from "./AppWrapper";

const noto = Vazirmatn({ subsets: ["arabic", "latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "فیوی",
  icons: [
    {
      url: "small-logo.svg",
      type: "image/x-icon",
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="rtl">
      <body className={`${noto.className}`}>
        <AppWrapper>
          <div>{children}</div>
        </AppWrapper>
      </body>
    </html>
  );
}
