"use client";

import { Modal, ModalHandle } from "@/src/components/Modal";
import { useActionResChecker } from "@/src/lib/client/hooks/useActionResChecker";
import { useLoading } from "@/src/lib/client/hooks/useLoading";
import { useShowAlertTimeout } from "@/src/lib/client/hooks/useShowAlert";
import { POSTER_MAX_VOLUME } from "@/src/lib/constants";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { addMovieAct, createMovieAct, searchMovieAct } from "./action";

type AddMovie = {
  name: string;
  year: string;
};

export function AddMovieModal() {
  const modalRefCreateMovie = useRef<ModalHandle>(null);
  const modalRefSearchMovie = useRef<ModalHandle>(null);

  const inputRefMoviePosterImgFile = useRef<HTMLInputElement>(null);
  const { loading, withLoading } = useLoading();
  const actionChecker = useActionResChecker();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddMovie>();

  const [inputImg, setInputImg] = useState(null as null | File);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(
    [] as MovieSearchRowData[]
  );
  const [showAddNewBtn, setShowAddNewBtn] = useState(false);
  const [showPosterFileSizeErr, setShowPosterFileSizeErr] = useState(false);

  const { showAlertTimeout } = useShowAlertTimeout();

  function onImgAdded(e: ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    if (files && files.length > 0) {
      const f = files[0];

      if (f.size > POSTER_MAX_VOLUME) {
        setShowPosterFileSizeErr(true);
        setTimeout(() => {
          setShowPosterFileSizeErr(false);
        }, 2000);
        return;
      }

      setInputImg(f);
    }
  }

  async function onCreateMovieFormSubmit({ name, year }: AddMovie) {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("year", year);

    if (inputImg != null) {
      fd.append("poster", inputImg);
    }

    withLoading(async () => {
      actionChecker({
        res: await createMovieAct(fd),
        onSuccess(alertShower, router) {
          alertShower.showAlertTimeout(
            "فیلم ثبت شد. پس از تایید قابل نمایش خواهد بود.",
            "success"
          );
          modalRefCreateMovie.current?.closeModal();
          cleanUp();
        },
        onOther(r, alertShower, router) {
          if (r == "movie-exists") {
            alertShower.showAlertTimeout("فیلم ثبت شد", "success");
            modalRefCreateMovie.current?.closeModal();
            cleanUp();
          }
        },
      });
    });
  }

  const doSearchText = useDebouncedCallback(async (q: string) => {
    setShowAddNewBtn(false);
    if (q == "") {
      setSearchResults([]);
      return;
    }

    const res = await searchMovieAct(q);
    setSearchResults(res);
    setShowAddNewBtn(true);
  }, 1000);

  function cleanUp() {
    setSearchResults([]);
    setSearchText("");
    setShowAddNewBtn(false);
    reset();
    setInputImg(null);
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-outline text-white w-full border-dashed border-2"
        onClick={() => {
          modalRefSearchMovie.current?.showModal();
        }}
      >
        <FontAwesomeIcon icon={faSquarePlus} className="w-5 h-5" />
      </button>

      {/* SEARCH MOVIE MODAL */}
      <Modal
        ref={modalRefSearchMovie}
        onBackDropClick={cleanUp}
        className=" flex flex-col max-h-screen"
      >
        <input
          type="text"
          className="input input-bordered text-2xl w-full"
          placeholder="نام فیلم"
          value={searchText}
          onChange={(e) => {
            const { value } = e.target;
            setSearchText(value);
            doSearchText(value);
          }}
        />

        <div className="h-96 overflow-y-auto">
          {searchResults.map((i) => (
            <MovieSearchRow
              key={i.id}
              {...i}
              onClick={async () => {
                actionChecker({
                  res: await addMovieAct(i.id),
                  onSuccess(alertShower, router) {
                    cleanUp();
                    modalRefSearchMovie.current?.closeModal();
                  },
                });
              }}
            />
          ))}
        </div>
        {showAddNewBtn && (
          <AddNewButton
            onClick={() => {
              modalRefSearchMovie.current?.closeModal();
              modalRefCreateMovie.current?.showModal();
              setValue("name", searchText);
            }}
            className="mt-3"
          />
        )}
      </Modal>
      {/* ADD NEW MOVIE MODAL */}
      <Modal ref={modalRefCreateMovie} onBackDropClick={cleanUp}>
        <form onSubmit={handleSubmit(onCreateMovieFormSubmit)}>
          <div className="flex w-full">
            {inputImg ? (
              <div className="w-32 h-48 overflow-hidden rounded-lg">
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
                className="btn btn-outline text-primary w-32 h-48 hover:text-primary active:text-primary"
                onClick={() => {
                  inputRefMoviePosterImgFile.current?.click();
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
                ref={inputRefMoviePosterImgFile}
              />
            </div>
          </div>

          <div
            className={`alert alert-error mt-3 ${
              showPosterFileSizeErr
                ? ""
                : " h-0 py-0 overflow-hidden border-none"
            } transition-all`}
          >
            حجم فایل انتخابی زیاد است.
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

function AddNewButton(P: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      className={`btn btn-outline btn-primary w-full border-dashed border-2 ${
        P.className ?? ""
      }`}
      onClick={P.onClick}
    >
      <FontAwesomeIcon icon={faSquarePlus} className="w-5 h-5" /> اضافه کردن
      فیلم جدید
    </button>
  );
}

type MovieSearchRowData = {
  id: number;
  posterLink: string | null;
  name: string;
  endYear: number;
};
function MovieSearchRow(P: MovieSearchRowData & { onClick: () => void }) {
  return (
    <button
      type="button"
      className="btn btn-ghost px-0 min-h-fit h-fit py-3
     flex items-center gap-2"
      onClick={P.onClick}
    >
      {P.posterLink ? (
        <Image
          src={P.posterLink}
          alt={`movie: "${P.name}" poster`}
          height={100}
          width={100}
          className="h-10 w-10 rounded-lg"
        />
      ) : (
        <div className="h-10 w-10 rounded-lg bg-primary " />
      )}

      <span>
        {P.name} - {P.endYear}
      </span>
    </button>
  );
}
