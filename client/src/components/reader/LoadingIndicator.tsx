import { Spinner } from "@heroui/react";
import clsx from "clsx";


interface Props {
  visible?: boolean;
}

export default function LoadingIndicator({ visible }: Props) {
 return (
    <div
      className={clsx(
        visible ? "block" : "hidden",
        "fixed z-100 inset-0 bg-white flex items-center justify-center"
      )}
    >
      <Spinner color="success" />
    </div>
  );
};