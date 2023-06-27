import { useDuration, useProgress } from "@/app/hooks";
import { useRef, useState } from "react";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
};

const ProgressBar = ({ videoRef, isPlaying }: Props) => {
  const [movingBall, setMovingBall] = useState(false);
  const [hidingBall, setHidingBall] = useState(false);
  const [showBall, setShowBall] = useState(false);

  const duration = useDuration(videoRef);

  const { progress, buffered } = useProgress(videoRef);

  const barRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const lastPlayingStateRef = useRef(false);

  const position = `${((progress / duration) * 100).toFixed(3)}%`;
  const bufferedPosition = `${((buffered / duration) * 100).toFixed(3)}%`;

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

    if (!hovering.current) {
      setHidingBall(true);
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onMouseEnter={() => {
        hovering.current = true;

        setHidingBall(false);
        setShowBall(true);
      }}
      onMouseLeave={() => {
        hovering.current = false;

        if (!movingBall) {
          setHidingBall(true);
        }
      }}
      className="group relative select-none pt-2 transition-[filter] duration-300 hover:cursor-pointer hover:brightness-105"
    >
      <div
        ref={barRef}
        className={`relative h-1 ${
          movingBall ? "scale-y-150" : ""
        } bg-white/10 transition-transform duration-300 group-hover:scale-y-150`}
      >
        <div
          style={{ width: bufferedPosition }}
          className="absolute inset-y-0 h-full bg-gray-300/40"
        />

        <div
          style={{ width: position }}
          className="relative h-full bg-miku-3"
        />
      </div>
      <div
        onAnimationEnd={() => {
          if (hidingBall) {
            setShowBall(false);
            setHidingBall(false);
          }
        }}
        style={{ left: position }}
        className={`absolute -top-1/3 ${
          movingBall || showBall ? "block" : "hidden"
        } ${
          hidingBall ? "animate-scale-out" : "animate-scale-in"
        } h-4 w-4 origin-bottom-left -translate-x-1/2 translate-y-1/3 cursor-pointer rounded-full border-[4px] border-miku-3 bg-miku-6 `}
      />
    </div>
  );
};

export default ProgressBar;
