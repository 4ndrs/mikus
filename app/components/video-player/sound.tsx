import { SoundFilled, SoundOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

import Button from "./button";

type Props = { videoRef: React.RefObject<HTMLVideoElement>; color?: string };

const Sound = ({ videoRef, color }: Props) => {
  const [volume, setVolume] = useState(0);

  const lastVolumeState = useRef(0.2);

  const position = `${volume * 100}%`;
  const barRef = useRef<HTMLDivElement>(null);
  const max = 1.0;

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const videoElement = videoRef.current;
    const storedVolume = localStorage.getItem("defaultVolume");

    const defaultVolume = storedVolume
      ? +storedVolume <= 1 && +storedVolume >= 0
        ? +storedVolume
        : 0.2
      : 0.2;

    videoElement.volume = defaultVolume;
    setVolume(defaultVolume);

    const handleVolumeChange = () => {
      setVolume(videoElement.volume);
      localStorage.setItem("defaultVolume", videoElement.volume.toString());
    };

    videoElement.addEventListener("volumechange", handleVolumeChange);

    return () => {
      videoElement.removeEventListener("volumechange", handleVolumeChange);
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

  const handleChange = (
    event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent
  ) => {
    if (
      !videoRef.current ||
      !barRef.current ||
      ("clientY" in event && event.clientY === 0)
    ) {
      return;
    }

    const clientY =
      "clientY" in event ? event.clientY : event.touches[0].clientY;

    const barRect = barRef.current.getBoundingClientRect();
    const relativeY = barRect.bottom - clientY;
    const tmp = relativeY / barRect.height;
    const percentage = tmp > 1 ? 1 : tmp < 0 ? 0 : tmp;
    const value = +(max * percentage).toFixed(3);

    videoRef.current.volume = value;
  };

  const handlePointerDown = (event: React.MouseEvent | React.TouchEvent) => {
    // allow only main button, usually left click
    if ("button" in event && event.button !== 0) {
      return;
    }

    handleChange(event);

    window.addEventListener("pointermove", handleChange);
    window.addEventListener("pointerup", handlePointerUp);

    window.addEventListener("touchmove", handleChange);
  };

  const handlePointerUp = () => {
    window.removeEventListener("pointermove", handleChange);
    window.removeEventListener("pointerup", handlePointerUp);

    window.removeEventListener("touchmove", handleChange);
  };

  const handleIconTouch = async (event: React.TouchEvent) => {
    // if it's not a "click" to toggle mute, control the audio up and down
    // yes, this is a hack, TODO: find a better way
    const id = setTimeout(() => handlePointerDown(event), 500);

    const volume = videoRef.current?.volume;

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (volume !== videoRef.current?.volume) {
      clearTimeout(id);
    }
  };

  return (
    <div className="group relative touch-none select-none hover:cursor-pointer">
      {/* hover helper to reach the volume level bar */}
      <div className="absolute inset-x-0 -top-3 bottom-6 bg-transparent" />

      <div
        ref={barRef}
        onPointerDown={handlePointerDown}
        className="absolute left-1/2 top-0 hidden -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-full bg-black/40 px-4 py-3 group-hover:block"
      >
        <div className="relative h-14 w-[0.34rem] rounded bg-slate-700/50">
          <div
            style={{ top: `calc(100% - ${position})`, backgroundColor: color }}
            className="absolute inset-x-0 bottom-0 rounded bg-miku-3"
          >
            <div
              style={{ backgroundColor: color }}
              className="absolute left-0 top-0 h-3 w-3 -translate-x-1/4 -translate-y-1/2 rounded-full bg-miku-3"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleToggleMute}
        onTouchStart={handleIconTouch}
        color={color}
      >
        {volume === 0 ? <SoundOutlined /> : <SoundFilled />}
      </Button>
    </div>
  );
};

export default Sound;
