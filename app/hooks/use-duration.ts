import { useEffect, useState } from "react";

const useDuration = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const videoElement = videoRef.current;
    const handleDurationChange = () => setDuration(videoElement.duration);

    setDuration(videoElement.duration);

    videoElement.addEventListener("durationchange", handleDurationChange);

    return () =>
      videoElement.removeEventListener("durationchange", handleDurationChange);
  }, [videoRef]);

  return duration;
};

export default useDuration;
