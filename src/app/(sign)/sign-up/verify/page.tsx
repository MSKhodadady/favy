import Link from "next/link";
import { SignLayout } from "../../SignLayout";
import { redirect } from "next/navigation";
import { verifyEmailVerificationToken } from "@/src/lib/server/tokenService";
import { userApi } from "@/src/api/user";

export default async function VerifyRegistrationPage({
  params,
  searchParams,
}: {
  params: {};
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams?.token;
  if (token == undefined || typeof token == "object") {
    redirect("/");
  }

  const res = await verifyEmailVerificationToken(token);

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

  //: set user verified
  const r = await userApi.setVerified(res.email);

  if (r == "user-not-exist") {
    return <>کاربری با این ایمیل وجود ندارد.</>;
  }

  return (
    <SignLayout title="ثبت نام با موفقیت تایید شد">
      <Link href={`/sign-in`}>
        <button type="button" className="btn btn-primary w-full">
          رفتن به صفحه ورود
        </button>
      </Link>
    </SignLayout>
  );
}
