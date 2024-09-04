"use client";

import { TextInput } from "@/src/components/TextInput";
import { useShowAlertTimeout } from "@/src/lib/client/hooks/useShowAlert";
import { emailErrorText, emailPattern } from "@/src/lib/utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { SignLayout } from "../../SignLayout";
import { sendLinkAgainAct } from "./action";

export default function SendAgainVerificationLinkPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<{ email: string }>();
  const { showAlertTimeout } = useShowAlertTimeout();
  const router = useRouter();
  return (
    <SignLayout title="ارسال دوباره ایمیل تایید">
      <form
        onSubmit={handleSubmit(async (data) => {
          const res = await sendLinkAgainAct(data.email);

          switch (res) {
            case "server-error":
              showAlertTimeout("خطای سرور", "warning");
              break;

            case "user-not-found":
              showAlertTimeout("کاربری با این ایمیل ثبت نام نکرده است.");
              break;

            case "success":
              router.push("/sign-up/success");

            case "success":

            default:
              break;
          }
        })}
      >
        <TextInput
          hasErr={errors.email != null}
          error={emailErrorText(errors.email)}
          placeHolder="ایمیل"
          inputType="email"
          inputProps={register("email", {
            pattern: emailPattern,
            required: true,
          })}
        />

        <button type="submit" className="btn btn-primary mt-3 w-full">
          ارسال دوباره ایمیل
        </button>
      </form>
    </SignLayout>
  );
}
