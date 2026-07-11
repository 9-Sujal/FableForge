import { Button } from "@heroui/react";
import clsx from "clsx";
import type { ReactNode } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface Props {
  side: "left" | "right";
  className?: string;
  onClick(): void;
}
export default function Navigator({ side, className, onClick }: Props) {
    let icon: ReactNode = <></>;
  let classesBySide = "";

  if (side === "left") {
    icon = <FaAngleLeft />;
    classesBySide = "left-0 pl-5";
  }

  if (side === "right") {
    icon = <FaAngleRight />;
    classesBySide = "right-0 pr-5";
  }

  return (
    <div className={clsx("fixed top-3/4 transition", classesBySide, className)}>
      <Button
        radius="full"
        variant="bordered"
        isIconOnly
        className="dark:border-book-dark text-slate-950 bg-slate-100 opacity-50 border-2 hover:border-amber-300 dark:text-book-dark"
        onClick={onClick}
      >
        {icon} 
      </Button>
    </div>
  );
};