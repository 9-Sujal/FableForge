import { Button } from "@heroui/react";
import clsx from "clsx";
import { MdOutlineClear } from "react-icons/md";

interface Props {
  visible?: boolean;
  onClear(): void;
  onSelect(color: string): void;
}

const colorOptions = ["red", "blue", "yellow"];
export default function HighlightOptions({ visible, onClear, onSelect }: Props) {
  return (
    <div
      className={clsx(
        visible ? "bottom-0" : "-bottom-14",
        "transition-all h-14 fixed z-50 left-0 right-0 flex items-center justify-center space-x-3 dark:bg-book-dark bg-gray-100"
      )}
    >
      {colorOptions.map((color) => {
        return (
          <button
            onClick={() => onSelect(color)}
            key={color}
            style={{ backgroundColor: color }}
            className="w-6 h-6 rounded-full"
          ></button>
        );
      })}

      <Button onClick={onClear} isIconOnly variant="light">
        <MdOutlineClear size={24} />
      </Button>
    </div>
  );
};
