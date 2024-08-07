import { ReactNode } from "react";
import { AlertProvider } from "../components/AlertProvider";
import { LoginStateProvider } from "../components/LoginProvider";
import { AppNavBar } from "../components/AppNavBar";
import "../styles/globals.css";
import { Noto_Naskh_Arabic, Vazirmatn } from "next/font/google";

const noto = Vazirmatn({ subsets: ["arabic", "latin", "latin-ext"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="rtl">
      <body className={`${noto.className}`}>
        <AlertProvider>
          <LoginStateProvider>
            {/* <AppNavBar /> */}
            <div>{children}</div>
          </LoginStateProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
