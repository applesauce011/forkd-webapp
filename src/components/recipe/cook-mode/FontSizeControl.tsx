"use client";

type FontSize = "sm" | "md" | "lg" | "xl";

interface FontSizeControlProps {
  value: FontSize;
  onChange: (size: FontSize) => void;
}

const SIZES: FontSize[] = ["sm", "md", "lg", "xl"];

export function FontSizeControl({ value, onChange }: FontSizeControlProps) {
  const currentIndex = SIZES.indexOf(value);

  function decrease() {
    if (currentIndex > 0) onChange(SIZES[currentIndex - 1]);
  }

  function increase() {
    if (currentIndex < SIZES.length - 1) onChange(SIZES[currentIndex + 1]);
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 select-none">Text</span>
      <button
        onClick={decrease}
        disabled={currentIndex === 0}
        aria-label="Decrease font size"
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold leading-none"
      >
        A<span className="text-xs -ml-0.5">−</span>
      </button>
      <button
        onClick={increase}
        disabled={currentIndex === SIZES.length - 1}
        aria-label="Increase font size"
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold leading-none"
      >
        A<span className="text-xs">+</span>
      </button>
    </div>
  );
}
