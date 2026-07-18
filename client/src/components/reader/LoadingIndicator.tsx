import { Spinner } from "@heroui/react";
import clsx from "clsx";

interface Props {
  visible?: boolean;
  progress?: number;
  downloaded?: number;
  total?: number;
}

export default function LoadingIndicator({
  visible,
  progress = 0,
  downloaded = 0,
  total = 0,
}: Props) {
  const downloadedMB = (downloaded / 1024 / 1024).toFixed(2);
  const totalMB = total
    ? (total / 1024 / 1024).toFixed(2)
    : "--";

  return (
    <div
      className={clsx(
        visible ? "flex" : "hidden",
        "fixed inset-0 z-9999 items-center justify-center",
        "bg-linear-to-br from-white/90 via-green-50/90 to-emerald-100/90",
        "dark:from-black/90 dark:via-zinc-950/95 dark:to-emerald-950/80",
        "backdrop-blur-xl"
      )}
    >
      <div className="relative w-90 rounded-3xl border border-white/20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.25)] p-8 overflow-hidden">

        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-green-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative flex flex-col items-center">

          {/* Spinner */}
          <div className="relative">

            <div className="absolute inset-0 animate-ping rounded-full bg-green-400/20" />

            <Spinner
              size="lg"
              color="success"
              classNames={{
                circle1: "border-[5px]",
                circle2: "border-[5px]",
              }}
            />

          </div>

   

          <h2 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-white">
            Opening Book
          </h2>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            Downloading your eBook securely from the cloud.
          </p>

         

          <div className="w-full mt-8">

            <div className="flex justify-between mb-2">

              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {progress}%
              </span>

              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {downloadedMB} MB / {totalMB} MB
              </span>

            </div>

            <div className="h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">

              <div
                className="h-full rounded-full bg-linear-to-r from-green-800 via-cyan-800 to-emerald-400 transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">

            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

            Preparing your reading experience...

          </div>

        </div>

      </div>
    </div>
  );
}
