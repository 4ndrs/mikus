import { useDuration, useProgress } from "@/app/hooks";
import { useRef, useState } from "react";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
};

const ProgressBar = ({ videoRef, isPlaying }: Props) => {
  const [movingBall, setMovingBall] = useState(false);

  const duration = useDuration(videoRef);
  const progress = useProgress(videoRef);

  const barRef = useRef<HTMLDivElement>(null);
  const lastPlayingStateRef = useRef(false);

  const position = `${((progress / duration) * 100).toFixed(3)}%`;

  const handleChange = (event: React.MouseEvent | MouseEvent | TouchEvent) => {
    if (
      !videoRef.current ||
      !barRef.current ||
      ("clientX" in event && event.clientX === 0)
    ) {
      return;
    }

    const clientX =
      "clientX" in event ? event.clientX : event.touches[0].clientX;

    const barRect = barRef.current.getBoundingClientRect();
    const relativeX = clientX - barRect.left;
    const tmp = relativeX / barRect.width;
    const percentage = tmp > 1 ? 1 : tmp < 0 ? 0 : tmp;
    const value = +(duration * percentage).toFixed(3);

    videoRef.current.currentTime = value;
  };

  const handlePointerDown = (event: React.MouseEvent) => {
    // only main button allowed, usually left click
    if (event.button !== 0) {
      return;
    }

    handleChange(event);

    if (isPlaying) {
      videoRef.current?.pause();
      lastPlayingStateRef.current = true;
    }

    setMovingBall(true);

    window.addEventListener("pointermove", handleChange);
    window.addEventListener("pointerup", handlePointerUp);

    window.addEventListener("touchmove", handleChange);
  };

  const handlePointerUp = () => {
    window.removeEventListener("pointermove", handleChange);
    window.removeEventListener("pointerup", handlePointerUp);

    window.removeEventListener("touchmove", handleChange);

    if (lastPlayingStateRef.current) {
      videoRef.current?.play();
      lastPlayingStateRef.current = false;
    }

    setMovingBall(false);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      className="group relative select-none pt-2 hover:cursor-pointer"
    >
      <div
        ref={barRef}
        className={`relative h-1 ${
          movingBall ? "scale-y-150" : ""
        } bg-slate-300 group-hover:scale-y-150`}
      >
        <div style={{ width: position }} className="h-full bg-white" />
      </div>
      <div
        style={{ left: position }}
        className={`absolute -top-1/3 ${
          movingBall ? "block" : "hidden"
        } h-4 w-4 -translate-x-1/2 translate-y-1/3 cursor-pointer rounded-full border-[3px] border-white bg-slate-300 group-hover:block`}
      />
    </div>
  );
};

export default ProgressBar;
