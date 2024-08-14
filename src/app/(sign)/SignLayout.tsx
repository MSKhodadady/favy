import { ReactNode } from "react";

export function SignLayout(P: {
  onSubmit: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={` rounded-md p-5 min-h-screen flex flex-col items-center justify-center `}
      style={{
        background: "linear-gradient(134.68deg, #F3C4C4 0.56%, #D0D0D0 100%)",
      }}
    >
      <div className="sm:mx-32 flex flex-col  rounded-lg p-5 bg-white shadow-2xl">
        <h1 className="text-3xl basis-1/2 pb-4 text-center">{P.title}</h1>
        <form
          className={`basis-1/2 flex flex-col ${P.className ?? ""}`}
          onSubmit={P.onSubmit}
        >
          {P.children}
        </form>
      </div>
    </main>
  );
}
