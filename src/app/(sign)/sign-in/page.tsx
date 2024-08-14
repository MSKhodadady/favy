"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { phoneSendAct, randVerify } from "./actions";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { SignLayout } from "../SignLayout";

export default function LoginPage() {
  type Inputs = {
    email: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({ email }) => {
    if (!isEnterRandMode) {
      const _randObj = await phoneSendAct();

      if (!_randObj) {
        alert("internal error");
      } else {
        setRandObj(_randObj);
        setRand({ v: "", err: "" });
      }
    } else {
      if (rand.v.length < 6) {
        setRand((o) => ({ ...o, err: "طول عدد کوتاه است." }));
        return;
      }
      const res = await randVerify(
        digitsEnToFa(email),
        randObj,
        digitsEnToFa(rand.v)
      );

      switch (res) {
        case "expired":
          setRandObj(null);
          break;

        case "not-correct":
          setRand((o) => ({ ...o, err: "عدد وارد شده صحیح نیست." }));
          break;

        case "not-verified":
          break;
      }
    }
  };

  return (
    <SignLayout title="ورود" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative w-full h-full">
        {isEnterRandMode && (
          <button
            type="button"
            className="btn btn-ghost absolute left-0 top-0 text-blue-600 text-xl"
            onClick={() => setRandObj(null)}
          >
            &#9998;
          </button>
        )}
        <input
          {...register("email", {
            required: true,

            pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          })}
          type="email"
          maxLength={11}
          minLength={11}
          placeholder="email"
          className={`input mb-1 w-full  ${
            errors.email != null ? " input-error" : ""
          }`}
          disabled={isEnterRandMode}
        />
      </div>
      <span className="text-red-600 text-sm mb-2">
        {errors.email?.type == "required"
          ? "لازم است"
          : errors.email?.type == "pattern"
          ? "ایمیل درست نیست."
          : ""}
      </span>

      <button type="submit" className={`btn btn-primary`}>
        ورود
      </button>
    </SignLayout>
  );
}
