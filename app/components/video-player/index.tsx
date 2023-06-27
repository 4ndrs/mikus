"use client";

import { useEffect, useRef, useState } from "react";

import {
  CaretRightFilled,
  HeartFilled,
  PauseOutlined,
  RetweetOutlined,
} from "@ant-design/icons";

import TimeVisualizer from "./time-visualizer";
import ProgressBar from "./progress-bar";
import Satanichia from "../../assets/1484726831236.png";
import Button from "./button";
import Sound from "./sound";
import Image from "next/image";

type Props = {
  src: string;
  loop?: boolean;
  autoPlay?: boolean;
};

const VideoPlayer = (props: Props) => {
  const [loop, setLoop] = useState(props.loop);
  const [error, setError] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hidingControls, setHidingControls] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const menuPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement?.paused) {
      setIsPlaying(false);
    }

    setError(false);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => setError(true);

    const handleEnded = () => {
      setHidingControls(false);
      setShowControls(true);
    };

    videoElement?.addEventListener("play", handlePlay);
    videoElement?.addEventListener("pause", handlePause);
    videoElement?.addEventListener("ended", handleEnded);
    videoElement?.addEventListener("error", handleError);

    return () => {
      videoElement?.removeEventListener("play", handlePlay);
      videoElement?.removeEventListener("pause", handlePause);
      videoElement?.removeEventListener("ended", handleEnded);
      videoElement?.removeEventListener("error", handleError);
    };
  }, [props.src]);

  const handlePlayToggle = () => {
    if (error) {
      return;
    }

    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  };

  const handleLoopToggle = () => {
    if (!videoRef.current || error) {
      return;
    }

    if (videoRef.current.loop) {
      videoRef.current.loop = false;
      setLoop(false);
    } else {
      videoRef.current.loop = true;
      setLoop(true);
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    menuPositionRef.current = { x: event.clientX, y: event.clientY };
    setOpenMenu(true);
  };

  return (
    <div
      onMouseEnter={() => {
        setHidingControls(false);
        setShowControls(true);
      }}
      onMouseLeave={() => {
        if (isPlaying) {
          setHidingControls(true);
        }
      }}
      className="group/player sticky top-0 z-[1] h-80 w-full bg-black lg:relative lg:h-[80vh] landscape:relative"
    >
      <video
        loop={props.loop}
        autoPlay={props.autoPlay}
        ref={videoRef}
        src={props.src}
        onClick={() => {
          if (showControls) {
            handlePlayToggle();
          } else {
            setShowControls(true);
          }
        }}
        onContextMenu={handleContextMenu}
        className={`${error ? "hidden" : "block"} mx-auto h-full`}
      />

      <div
        className={`${
          error ? "flex" : "hidden"
        } mt-auto h-full w-full flex-1 flex-col items-center justify-start lg:justify-center`}
      >
        <Image
          alt="Satanichia Kurumizawa Mcdowell"
          src={Satanichia}
          placeholder="blur"
          className="h-[60%] w-auto"
        />
        <p className="m-3 text-center">
          Failed to init decoder. Unsupported webms, perhaps?
        </p>
      </div>

      <div
        style={{
          top: menuPositionRef.current.y,
          left: menuPositionRef.current.x,
        }}
        className={`${
          openMenu ? "flex" : "hidden"
        } fixed h-12 w-24 items-center justify-center gap-2 rounded bg-black`}
      >
        <div
          onClick={() => setOpenMenu(false)}
          className="fixed inset-0 bg-transparent"
        />
        <HeartFilled className="text-red-600" /> Mikus
      </div>
      <div
        onAnimationEnd={() => {
          if (hidingControls) {
            setHidingControls(false);
            setShowControls(false);
          }
        }}
        className={`${
          !showControls
            ? "hidden"
            : hidingControls
            ? "flex animate-fade-out"
            : "flex animate-fade-in"
        } absolute bottom-0 left-0 right-0 mx-6 flex-col gap-4 bg-black/20 p-2`}
      >
        <ProgressBar videoRef={videoRef} isPlaying={isPlaying} />

        <div className="flex items-center justify-between">
          <TimeVisualizer videoRef={videoRef} />

          <div className="flex gap-1">
            <Button
              aria-label={`${isPlaying ? "pause" : "play"} video`}
              onClick={handlePlayToggle}
            >
              {isPlaying ? <PauseOutlined /> : <CaretRightFilled />}
            </Button>
            <Button
              aria-label={`${loop ? "disable" : "activate"} loop`}
              className={`${loop ? "" : "text-slate-400"}`}
              onClick={handleLoopToggle}
            >
              <RetweetOutlined />
            </Button>
          </div>

          <Sound videoRef={videoRef} />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
