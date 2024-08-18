"use client";

import { useLoading } from "@/src/lib/client/hooks/useLoading";
import { useShowAlert } from "@/src/lib/client/hooks/useShowAlert";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignLayout } from "../SignLayout";
import { registerAct } from "./action";
import { TextInput } from "@/src/components/TextInput";
import {
  passwordPattern,
  matchCase,
  emailPattern,
  emailErrorText,
} from "@/src/lib/utils";
import { useRouter } from "next/navigation";

export type RegisterInput = {
  username: string;
  password: string;
  passwordRepeat: string;
  email: string;
};

export default function SignPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterInput>();
  const { showAlert } = useShowAlert();
  const { loading, withLoading } = useLoading();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const { password, passwordRepeat } = data;

    if (password != passwordRepeat) {
      setError("passwordRepeat", { message: "پسورد ها یکی نیستند." });
      return;
    }

    withLoading(async () => {
      const res = await registerAct(data);

      switch (res) {
        case "success":
          router.push("/sign-up/success");
          break;

        case "server-error":
          showAlert("خطای سرور", "warning");
          break;

        case "user-exist":
          showAlert("کاربر با این ایمیل یا نام کاربری وجود دارد.");

        default:
          break;
      }
    });
  });

  return (
    <SignLayout title="ثبت نام" className="space-y-2">
      {/* EMAIL */}
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <TextInput
          placeHolder="ایمیل"
          hasErr={errors.email != null}
          error={emailErrorText(errors.email)}
          inputProps={register("email", {
            required: true,
            pattern: emailPattern,
          })}
        />
        {/* USERNAME */}
        <TextInput
          inputProps={register("username", {
            required: true,
            pattern: /^[A-Za-z_]{8,}$/,
          })}
          placeHolder="نام کاربری"
          hasErr={errors.username != null}
          error={matchCase(
            {
              required: "لازم است.",
              pattern: "نادرست است.",
              value: errors.username?.message,
              "": "",
            },
            errors.username?.type ?? ""
          )}
        />
        {/* PASSWORD */}
        <TextInput
          inputProps={register("password", {
            required: true,
            pattern: passwordPattern,
          })}
          inputType="password"
          placeHolder="پسورد"
          hasErr={errors.password != null}
          error={matchCase(
            {
              required: "لازم است.",
              pattern:
                "حداقل ۸ کاراکتر، شامل حرف کوچک انگلیسی، حرف بزرگ انگلیسی، عدد و یکی از نشانه های @$!%*?&_",
              "": "",
            },
            errors.password?.type ?? ""
          )}
        />

        <TextInput
          inputProps={register("passwordRepeat", {
            required: true,
            pattern: passwordPattern,
          })}
          inputType="password"
          placeHolder="تکرار پسورد"
          hasErr={errors.passwordRepeat != null}
          error={matchCase(
            {
              required: "لازم است.",
              pattern:
                "حداقل ۸ کاراکتر، شامل حرف کوچک انگلیسی، حرف بزرگ انگلیسی، عدد و یکی از نشانه های @$!%*?&_",
              unknown: errors.passwordRepeat?.message,
            },
            errors.passwordRepeat?.type ?? "unknown"
          )}
        />

        {/* SUBMIT */}
        <button type="submit" className={`btn btn-primary`} disabled={loading}>
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "ثبت نام"
          )}
        </button>
      </form>

      <Link
        className="text-blue-700 pt-3 italic underline underline-offset-8"
        href={"/sign-up/send-link"}
      >
        قبلا ثبت نام کردید ولی ایمیل تایید دریافت نکردید.
      </Link>
    </SignLayout>
  );
}
