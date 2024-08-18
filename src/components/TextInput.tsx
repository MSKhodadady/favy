"use client";
export function TextInput(P: {
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
