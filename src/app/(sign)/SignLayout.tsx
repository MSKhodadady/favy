import { AppLogoWithTitle } from "@/src/components/AppLogo";
import Link from "next/link";
import { ReactNode } from "react";

export function SignLayout(P: {
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={` rounded-md p-5 min-h-screen flex flex-col items-center justify-center `}
      style={{
        background: "linear-gradient(134.68deg, #F3C4C4 0.56%, #D0D0D0 100%)",
      }}
    >
      <div className="flex-grow flex items-center justify-center max-w-md w-full">
        <div className=" w-full flex flex-col items-stretch rounded-lg p-5 bg-white shadow-2xl">
          <Link className="flex justify-center mb-3" href={"/"}>
            <AppLogoWithTitle />
          </Link>
          <hr />
          <h1 className="text-3xl basis-1/2 pb-4 text-start mt-3">{P.title}</h1>
          <div className={`flex flex-col ${P.className ?? ""} w-full`}>
            {P.children}
          </div>
        </div>
      </div>
    </main>
  );
}
