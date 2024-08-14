import { Vazirmatn } from "next/font/google";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../styles/globals.css";
import { AlertViewer } from "./AppWrapper";

const noto = Vazirmatn({ subsets: ["arabic", "latin", "latin-ext"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="rtl">
      <body className={`${noto.className}`}>
        <Provider store={store}>
          <AlertViewer />
          <div>{children}</div>
        </Provider>
      </body>
    </html>
  );
}
