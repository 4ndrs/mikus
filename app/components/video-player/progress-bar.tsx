import { useRef } from "react";

type Props = {
  max: number;
  current: number;
  onChange: (value: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
};

const ProgressBar = ({
  max,
  current,
  onChange,
  onDragStart,
  onDragEnd,
}: Props) => {
  const barRef = useRef<HTMLDivElement>(null);
  const position = `${((current / max) * 100).toFixed(3)}%`;

  const handleChange = (event: React.MouseEvent | MouseEvent) => {
    if (!barRef.current || event.clientX === 0) {
      return;
    }

    const barRect = barRef.current.getBoundingClientRect();
    const relativeX = event.clientX - barRect.left;
    const percentage = (relativeX / barRect.width) * 100;
    const value = +((max * percentage) / 100).toFixed(3);

    onChange(value);
  };

  const handlePointerDown = (event: React.MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    handleChange(event);

    onDragStart();

    window.addEventListener("pointermove", handleChange);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerUp = () => {
    window.removeEventListener("pointermove", handleChange);
    window.removeEventListener("pointerup", handlePointerUp);

    onDragEnd();
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      className="relative select-none pt-2 hover:cursor-pointer"
    >
      <div
        ref={barRef}
        className="relative h-1 overflow-hidden rounded bg-slate-300"
      >
        <div style={{ width: position }} className="h-full bg-white" />
      </div>
      <div
        style={{ left: position }}
        className="absolute -top-1/3 h-4 w-4 -translate-x-1/2 translate-y-1/3 cursor-pointer rounded-full border-[3px] border-white bg-slate-300"
      />
    </div>
  );
};

export default ProgressBar;
