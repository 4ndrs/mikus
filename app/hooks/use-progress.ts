import { useEffect, useRef, useState } from "react";

const useProgress = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [progress, setProgress] = useState(0);

  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const videoElement = videoRef.current;

    const handleTimeUpdate = () => {
      const current = videoElement.currentTime;
      const difference = (current - lastUpdateRef.current) * 1000;

      // Update after x milliseconds
      const milliseconds = 300;

      if (difference < 0 || difference > milliseconds) {
        setProgress(current);
        lastUpdateRef.current = current;
      }
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoRef]);

  return progress;
};

export default useProgress;