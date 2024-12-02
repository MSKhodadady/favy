"use client";

import { TextInput } from "@/src/components/TextInput";
import { useLoading } from "@/src/lib/client/hooks/useLoading";
import { useShowAlertTimeout } from "@/src/lib/client/hooks/useShowAlert";
import {
  emailErrorText,
  emailPattern,
  matchCase,
  passwordPattern,
  passwordPatternError,
  usernamePattern,
  usernamePatternErr,
} from "@/src/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { SignLayout } from "../SignLayout";
import { registerAct } from "./action";

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
  const { showAlertTimeout } = useShowAlertTimeout();
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
          showAlertTimeout("خطای سرور", "warning");
          break;

        case "user-exist":
          showAlertTimeout("کاربر با این ایمیل یا نام کاربری وجود دارد.");

        default:
          break;
      }
    });
  });

  return (
    <SignLayout title="ثبت نام" className="space-y-2">
      <title>ثبت نام</title>
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
            pattern: usernamePattern,
          })}
          placeHolder="نام کاربری"
          hasErr={errors.username != null}
          error={matchCase(
            {
              required: "لازم است.",
              pattern: usernamePatternErr,
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
              pattern: passwordPatternError,
              unknown: errors.passwordRepeat?.message,
            },
            errors.password?.type ?? "unknown"
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
              pattern: passwordPatternError,
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
        className="text-center w-full text-blue-700 pt-3 italic underline underline-offset-8"
        href={"/sign-up/send-link"}
      >
        قبلا ثبت نام کردید ولی ایمیل تایید دریافت نکردید.
      </Link>
    </SignLayout>
  );
}
