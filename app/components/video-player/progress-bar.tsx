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
        } bg-slate-900/20 transition-transform duration-300 group-hover:scale-y-150`}
      >
        <div style={{ width: position }} className="h-full bg-miku-3" />
      </div>
      <div
        style={{ left: position }}
        className={`absolute -top-1/3 ${
          movingBall ? "block" : "hidden group-hover:block"
        } h-4 w-4 origin-bottom-left -translate-x-1/2 translate-y-1/3 animate-scale-in cursor-pointer rounded-full border-[4px] border-miku-3 bg-miku-6 `}
      />
    </div>
  );
};

export default ProgressBar;
