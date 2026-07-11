import { type InputHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  src?: string;
  isInvalid?: boolean;
  fileName?: string;
  errorMessage?: ReactNode;
}

export default function PosterSelector({
  fileName,
  errorMessage,
  isInvalid,
  src,
  ...props
}: Props){
  return (
    <div>
      <label
        className={clsx(
          "cursor-pointer inline-block",
          isInvalid && "text-red-400"
        )}
        htmlFor={props.name}
      >
        <input {...props} type="file" id={props.name} className="hidden" />

        <div
          className={clsx(
            "hover:bg-amber-200 bg-amber-100 transition w-28 h-32 flex items-center justify-center rounded-md overflow-hidden cursor-pointer",
            isInvalid ? "ring-2 ring-red-400" : "bg-default-100"
          )}
        > 
          {src ? (
            <img src={src} alt="poster" className="object-fill" />
          ) : (
            <p className="text-sm ">Select Poster</p>
          )}
        </div>
        {fileName ? <p className="w-fit p-1 rounded-3xl text-sm truncate bg-slate-300 ">{fileName}</p> : null}
        {errorMessage}
      </label>
    </div>
  );
};