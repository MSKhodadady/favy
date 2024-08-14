"use client";

import { useForm } from "react-hook-form";
import { SignLayout } from "../SignLayout";
import { registerAct } from "./action";
import { useState } from "react";

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

  const [successRegister, setSuccessRegister] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    const { email, password, passwordRepeat, username } = data;

    if (password != passwordRepeat) {
      setError("passwordRepeat", { message: "پسورد ها یکی نیستند." });
      return;
    }

    const res = await registerAct(data);

    if (res) {
      setSuccessRegister(true);
    } else {
    }
  });

  return (
    <SignLayout onSubmit={onSubmit} title="ثبت نام" className="space-y-2">
      {/* EMAIL */}
      <TextInput
        placeHolder="ایمیل"
        hasErr={errors.email != null}
        error={matchCase(
          {
            required: "لازم است",
            pattern: "نادرست است",
            value: errors.email?.message,
            "": "",
          },
          errors.email?.type ?? ""
        )}
        inputProps={register("email", {
          required: true,
          pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/,
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
          pattern:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
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
          pattern:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
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
      <button type="submit" className={`btn btn-primary`}>
        ثبت نام
      </button>
    </SignLayout>
  );
}

const matchCase = (m: Record<string, any>, s: string) => m[s];

function TextInput(P: {
  placeHolder: string;
  hasErr: boolean;
  error: string;
  inputProps: any;
  className?: string;
  inputType?: string;
}) {
  return (
    <label className={`form-control w-full ${P.className ?? ""}`}>
      <input
        {...P.inputProps}
        type={P.inputType ?? "text"}
        placeholder={P.placeHolder}
        className={`input input-bordered ${
          P.hasErr ? "input-error !border-error " : ""
        } border-gray-300 w-full `}
      />
      {P.hasErr && (
        <div className="label">
          <span className="label-text-alt text-error">{P.error}</span>
        </div>
      )}
    </label>
  );
}
