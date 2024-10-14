import { dbTransactions } from "@/src/lib/server/db";
import { verifyToken } from "@/src/lib/server/tokenService";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignLayout } from "../../SignLayout";

export default async function VerifyRegistrationPage({
  searchParams,
}: {
  params: {};
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams?.token;
  if (token == undefined || typeof token == "object") {
    redirect("/");
  }

  const res = await verifyToken(token);

  if (res == "expired") {
    return (
      <>
        <SignLayout title="">
          <h1 className="text-center text-xl mb-2">
            اعتبار ایمیل تایید، تمام شده است.
          </h1>
          <Link
            className="text-center italic underline text-blue-500"
            href={"/sign-up/send-link"}
          >
            دریافت دوباره ایمیل تایید
          </Link>
        </SignLayout>
      </>
    );
  }

  if (res == "invalid-token") {
    return <>آدرس نامعتبر است.</>;
  }

  try {
    //: set user verified
    await dbTransactions.user.setVerified(res.email);

    return (
      <SignLayout title="ثبت نام با موفقیت تایید شد">
        <Link href={`/sign-in`}>
          <button type="button" className="btn btn-primary w-full">
            رفتن به صفحه ورود
          </button>
        </Link>
      </SignLayout>
    );
  } catch (error) {
    console.error(error);
    redirect("/internal-server-error");
  }
}
