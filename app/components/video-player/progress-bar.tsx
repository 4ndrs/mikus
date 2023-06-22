import { useEffect, useRef, useState } from "react";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

const ProgressBar = ({ videoRef }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const barRef = useRef<HTMLDivElement>(null);
  const lastUpdateRef = useRef(0);
  const lastPlayingStateRef = useRef(false);

  const position = `${((progress / duration) * 100).toFixed(3)}%`;

  useEffect(() => {
    const videoElement = videoRef.current;

    setDuration(videoElement?.duration || 0);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleTimeUpdate = () => {
      const current = videoElement?.currentTime || 0;
      const difference = (current - lastUpdateRef.current) * 1000;

      // Update after x milliseconds
      const milliseconds = 300;

      if (difference < 0 || difference > milliseconds) {
        setProgress(current);
        lastUpdateRef.current = current;
      }
    };

    videoElement?.addEventListener("play", handlePlay);
    videoElement?.addEventListener("pause", handlePause);
    videoElement?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement?.removeEventListener("play", handlePlay);
      videoElement?.removeEventListener("pause", handlePause);
      videoElement?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoRef]);

  const handleChange = (event: React.MouseEvent | MouseEvent) => {
    if (!videoRef.current || !barRef.current || event.clientX === 0) {
      return;
    }

    const barRect = barRef.current.getBoundingClientRect();
    const relativeX = event.clientX - barRect.left;
    const percentage = (relativeX / barRect.width) * 100;
    const value = +((duration * percentage) / 100).toFixed(3);

    videoRef.current.currentTime = value;
  };

  const handlePointerDown = (event: React.MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    handleChange(event);

    if (isPlaying) {
      videoRef.current?.pause();
      lastPlayingStateRef.current = true;
    }

    window.addEventListener("pointermove", handleChange);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerUp = () => {
    window.removeEventListener("pointermove", handleChange);
    window.removeEventListener("pointerup", handlePointerUp);

    if (lastPlayingStateRef.current) {
      videoRef.current?.play();
      lastPlayingStateRef.current = false;
    }
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
