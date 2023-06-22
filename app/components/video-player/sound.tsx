import { SoundFilled, SoundOutlined } from "@ant-design/icons";
import { useRef } from "react";

type Props = {
  muted: boolean;
  current: number;
  onClick: () => void;
  onChange: (value: number) => void;
};

const Sound = ({ muted, onClick, current, onChange }: Props) => {
  const position = `${current * 100}%`;
  const barRef = useRef<HTMLDivElement>(null);
  const max = 1.0;

  const handleChange = (event: React.MouseEvent | MouseEvent) => {
    if (!barRef.current || event.clientY === 0) {
      return;
    }

    const barRect = barRef.current.getBoundingClientRect();
    const relativeY = barRect.bottom - event.clientY;
    const percentage = (relativeY / barRect.height) * 100;
    const value = +((max * percentage) / 100).toFixed(3);

    onChange(value > 1 ? 1 : value < 0 ? 0 : value);
  };

  const handlePointerDown = (event: React.MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    handleChange(event);

    window.addEventListener("pointermove", handleChange);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerUp = () => {
    window.removeEventListener("pointermove", handleChange);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  return (
    <div className="relative select-none hover:cursor-pointer">
      <div
        ref={barRef}
        onPointerDown={handlePointerDown}
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded bg-slate-600 px-4 py-2"
      >
        <div className="relative h-14 w-[0.34rem] rounded bg-slate-700">
          <div
            style={{ top: `calc(100% - ${position})` }}
            className="absolute inset-x-0 bottom-0 rounded bg-white"
          >
            <div className="absolute left-0 top-0 h-3 w-3 -translate-x-1/4 -translate-y-1/2 rounded-full bg-white" />
          </div>
        </div>
      </div>

      <button onClick={onClick}>
        {muted ? <SoundOutlined /> : <SoundFilled />}
      </button>
    </div>
  );
};

export default Sound;
