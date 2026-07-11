import clsx from "clsx";
import type { ReactNode } from "react";


interface ToolButtonProps {
  onClick?(): void;
  isActive?: boolean;
  children: ReactNode;
}

export default function ToolButton({ children, isActive, onClick }: ToolButtonProps){
  return (
    <button
      onClick={onClick}
      type="button"
      className={clsx("p-1 rounded", isActive && "bg-black text-white")}
    >
      {children}
    </button>
  );
};

