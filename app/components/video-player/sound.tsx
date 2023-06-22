import { SoundFilled, SoundOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

type Props = { videoRef: React.RefObject<HTMLVideoElement> };

const Sound = ({ videoRef }: Props) => {
  const [volume, setVolume] = useState(0);

  const lastVolumeState = useRef(0);

  const position = `${volume * 100}%`;
  const barRef = useRef<HTMLDivElement>(null);
  const max = 1.0;

  useEffect(() => {
    const videoElement = videoRef.current;

    setVolume(videoElement?.volume || 0);

    const handleVolumeChange = () => setVolume(videoElement?.volume || 0);

    videoElement?.addEventListener("volumechange", handleVolumeChange);

    return () => {
      videoElement?.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [videoRef]);

  const handleToggleMute = () => {
    if (!videoRef.current) {
      return;
    }

    if (volume === 0) {
      videoRef.current.volume = lastVolumeState.current;
    } else {
      lastVolumeState.current = volume;
      videoRef.current.volume = 0;
    }
  };

  const handleChange = (event: React.MouseEvent | MouseEvent) => {
    if (!videoRef.current || !barRef.current || event.clientY === 0) {
      return;
    }

    const barRect = barRef.current.getBoundingClientRect();
    const relativeY = barRect.bottom - event.clientY;
    const tmp = relativeY / barRect.height;
    const percentage = tmp > 1 ? 1 : tmp < 0 ? 0 : tmp;
    const value = +(max * percentage).toFixed(3);

    videoRef.current.volume = value;
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

      <button onClick={handleToggleMute}>
        {volume === 0 ? <SoundOutlined /> : <SoundFilled />}
      </button>
    </div>
  );
};

export default Sound;
