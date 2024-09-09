"use client";

import { Modal, ModalHandle } from "@/src/components/Modal";
import { useActionResChecker } from "@/src/lib/client/hooks/useActionResChecker";
import { useLoading } from "@/src/lib/client/hooks/useLoading";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createMovieAct } from "./action";

type AddMovie = {
  name: string;
  year: string;
};

export function AddMovieModal() {
  const modalRef = useRef<ModalHandle>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { loading, withLoading } = useLoading();
  const actionChecker = useActionResChecker();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddMovie>();

  const [inputImg, setInputImg] = useState(null as null | File);

  function onImgAdded(e: ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    if (files && files.length > 0) {
      const f = files[0];
      setInputImg(f);
    }
  }

  async function onFormSubmit({ name, year }: AddMovie) {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("year", year);

    if (inputImg != null) fd.append("poster", inputImg);

    withLoading(async () => {
      actionChecker({
        res: await createMovieAct(fd),
        onSuccess(alertShower, router) {
          alertShower.showAlertTimeout(
            "فیلم ثبت شد. پس از تایید قابل نمایش خواهد بود.",
            "success"
          );
        },
        onOther(r, alertShower, router) {
          if (r == "no-user") {
            alertShower.showMustLogin();
            router.push("/sign-in");
          } else {
            alertShower.showInternalErr();
          }
        },
      });
    });
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-outline text-white w-full border-dashed border-2"
        onClick={() => {
          modalRef.current?.showModal();
        }}
      >
        <FontAwesomeIcon icon={faSquarePlus} className="w-5 h-5" />
      </button>

      <Modal
        ref={modalRef}
        onBackDropClick={() => {
          reset();
          setInputImg(null);
        }}
      >
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="flex w-full">
            {inputImg ? (
              <div className="min-w-28 w-28 h-44 overflow-hidden rounded-lg">
                <Image
                  src={URL.createObjectURL(inputImg)}
                  width={2800}
                  height={4400}
                  alt="chosen img"
                  className="object-cover object-center w-full h-full"
                />
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-outline text-primary min-w-28 w-28 h-44 hover:text-primary active:text-primary"
                onClick={() => {
                  inputFileRef.current?.click();
                }}
              >
                <FontAwesomeIcon icon={faSquarePlus} size="3x" />
              </button>
            )}
            <div className="flex flex-col justify-around ms-3 w-fit">
              <input
                type="text"
                placeholder="نام فیلم"
                className={`input input-ghost w-full text-2xl ${
                  !!errors.name ? "input-error" : ""
                }`}
                {...register("name", {
                  required: true,
                })}
              />
              <input
                type="text"
                placeholder="سال انتشار"
                className={`input input-ghost w-full text-lg ${
                  !!errors.year ? "input-error" : ""
                }`}
                {...register("year", {
                  required: true,
                  minLength: 4,
                  maxLength: 9,
                  pattern: /^\d{4}$/,
                })}
              />

              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onImgAdded}
                ref={inputFileRef}
              />
            </div>
          </div>
          {loading ? (
            <progress className="progress progress-success w-full"></progress>
          ) : (
            <button type="submit" className="btn btn-primary w-full mt-3">
              ثبت
            </button>
          )}
        </form>
      </Modal>
    </>
  );
}
