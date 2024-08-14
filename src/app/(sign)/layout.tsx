import { AUTH_COOKIE_KEY } from "@/src/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function SignInLayout({ children }: { children: ReactNode }) {
  const authCookie = cookies().get(AUTH_COOKIE_KEY);

  if (authCookie != undefined) redirect("/u/"); //: TODO go to user name

  return <>{children}</>;
}
