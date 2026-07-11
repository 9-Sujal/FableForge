import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { HiColorSwatch } from "react-icons/hi";

export type ThemeModes = "light" | "dark";
interface Props {
  onThemeSelect?(mode: ThemeModes): void;
}
export default function ThemeOptions({ onThemeSelect }: Props) {
  return (
    <Popover  showArrow offset={20}>
      <PopoverTrigger>
        <Button variant="light" isIconOnly>
          <HiColorSwatch size={30} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="dark:bg-book-dark sm:dark:bg-book-dark sm:dark:text-book-dark  dark:text-book-dark">
        <div className="flex items-center justify-center bg-slate-500 text-white space-x-3 p-3">
          <button onClick={() => onThemeSelect && onThemeSelect("light")}>
            Light
          </button>
          <button onClick={() => onThemeSelect && onThemeSelect("dark")}>
            Dark
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};