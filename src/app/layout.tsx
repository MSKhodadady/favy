import { Vazirmatn } from "next/font/google";
import { ReactNode } from "react";

import "../styles/globals.css";
import { AppWrapper } from "./AppWrapper";

const noto = Vazirmatn({ subsets: ["arabic", "latin", "latin-ext"] });

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
