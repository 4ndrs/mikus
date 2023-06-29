import { useEffect, useState } from "react";

const useProgress = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    let id: NodeJS.Timer;

    const milliseconds = 350;
    const videoElement = videoRef.current;

    const handleLoadedData = () => {
      setBuffered(videoElement.buffered.end(0));
      setProgress(0);
      clearInterval(id);
    };

    const update = () => {
      setProgress(videoElement.currentTime);

      if (videoElement.buffered.length > 0) {
        setBuffered(videoElement.buffered.end(0));
      }
    };

    const handlePlay = () => {
      id = setInterval(update, milliseconds);
    };

    const handlePause = () => {
      clearInterval(id);
    };

    // the options are decrease ms or handler below, TODO: find alternative
    const handleSeeking = () => setProgress(videoElement.currentTime);

    videoElement.addEventListener("loadeddata", handleLoadedData);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("seeking", handleSeeking);

    return () => {
      videoElement.removeEventListener("loadeddata", handleLoadedData);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("seeking", handleSeeking);

      clearInterval(id);
    };
  }, [videoRef]);

  return { progress, buffered };
};

export default useProgress;
