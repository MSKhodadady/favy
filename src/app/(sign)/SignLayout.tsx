import { favyLogoWithTitle } from "@/src/lib/client/assets";
import Image from "next/image";
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
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md flex flex-col items-stretch rounded-lg p-5 bg-white shadow-2xl">
          <Link className="flex justify-center mb-3" href={"/"}>
            <Image
              src={favyLogoWithTitle}
              alt="favy logo with title"
              className="w-2/3 h-auto"
            />
          </Link>
          <hr />
          <h1 className="text-3xl basis-1/2 pb-4 text-start mt-3">{P.title}</h1>
          <div className={`flex flex-col ${P.className ?? ""}`}>
            {P.children}
          </div>
        </div>
      </div>
    </main>
  );
}
