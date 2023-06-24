import { useDuration } from "@/app/hooks";
import { useEffect, useRef, useState } from "react";

type Props = { videoRef: React.RefObject<HTMLVideoElement> };

const TimeVisualizer = ({ videoRef }: Props) => {
  const [progress, setProgress] = useState(0);

  const duration = useDuration(videoRef);

  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const videoElement = videoRef.current;

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

    videoElement?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoRef]);

  const parseTime = (seconds: number) =>
    `${("0" + Math.floor(seconds / 60)).slice(-2)}:${(
      "0" + Math.floor(seconds % 60)
    ).slice(-2)}`;

  return (
    <div className="flex text-[1rem]">
      <div className="w-[3.1rem]">{parseTime(progress)}</div> /{" "}
      <div className="w-[3.1rem] text-right text-slate-300">
        {parseTime(duration)}
      </div>
    </div>
  );
};

export default TimeVisualizer;
