"use client";

import { TextInput } from "@/src/components/TextInput";
import { useLoading } from "@/src/lib/client/hooks/useLoading";
import { useShowAlertTimeout } from "@/src/lib/client/hooks/useShowAlert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignLayout } from "../SignLayout";
import { loginAct } from "./actions";

export default function LoginPage() {
  type Inputs = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { showAlertTimeout } = useShowAlertTimeout();
  const router = useRouter();
  const { loading, withLoading } = useLoading();

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    withLoading(async () => {
      const res = await loginAct(email, password);

      const { mode } = res;

      switch (mode) {
        case "not-correct":
          showAlertTimeout("ایمیل یا پسورد اشتباه است.");
          break;

        case "email-not-verified":
          showAlertTimeout("ایمیل شما هنوز تایید نشده است.");
          break;

        case "server-error":
          showAlertTimeout("خطای سرور", "warning");

          break;

        case "success":
          showAlertTimeout("با موفقیت وارد شدید.", "success");
          router.push(`/u/${res.username}`);

        default:
          break;
      }
    });
  };

  return (
    <SignLayout title="ورود">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-stretch gap-2"
      >
        <TextInput
          inputProps={{
            ...register("email", {
              required: true,

              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            }),
          }}
          // inputType=""
          placeHolder="ایمیل"
          hasErr={errors.email != undefined}
          error={
            errors.email?.type == "required"
              ? "لازم است"
              : errors.email?.type == "pattern"
              ? "ایمیل درست نیست."
              : ""
          }
        />

        <TextInput
          inputProps={register("password", {
            required: true,
          })}
          inputType="password"
          placeHolder="پسورد"
          hasErr={errors.password != undefined}
          error={errors.password?.type == "required" ? "لازم است" : "خطا"}
        />

        <button type="submit" className={`btn btn-primary`} disabled={loading}>
          ورود
        </button>

        <Link
          href={"/sign-up"}
          className="text-blue-700 italic underline underline-offset-4 text-center mt-3"
        >
          هنوز ثبت نام نکردید!
        </Link>
      </form>
    </SignLayout>
  );
}
