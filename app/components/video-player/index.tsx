"use client";

import { useEffect, useRef, useState } from "react";

import {
  CaretRightFilled,
  FullscreenExitOutlined,
  FullscreenOutlined,
  HeartFilled,
  LoadingOutlined,
  MenuOutlined,
  MinusSquareOutlined,
  PauseOutlined,
  PlusSquareOutlined,
  RetweetOutlined,
  StepBackwardFilled,
  StepForwardFilled,
} from "@ant-design/icons";

import { ProgressBarProvider, useColor } from "@/app/context";
import TimeVisualizer from "./time-visualizer";
import ProgressBar from "./progress-bar";
import Satanichia from "../../assets/1484726831236.png";
import Button from "./button";
import Sound from "./sound";
import Image from "next/image";

type Props = {
  src: string;
  nextHref?: string;
  previousHref?: string;
  smolMode?: boolean;
  onSmolModeToggle?: () => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  onPlaylistOpen: () => void;
};

const VideoPlayer = (props: Props) => {
  const [loop, setLoop] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hideCursor, setHideCursor] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hidingControls, setHidingControls] = useState(false);

  const color = useColor();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mainDivRef = useRef<HTMLDivElement>(null);
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

    const handleLoading = () => setLoading(true);
    const handleNotLoading = () => setLoading(false);

    const handleEnded = () => {
      setHidingControls(false);
      setShowControls(true);
    };

    videoElement?.addEventListener("play", handlePlay);
    videoElement?.addEventListener("pause", handlePause);
    videoElement?.addEventListener("ended", handleEnded);
    videoElement?.addEventListener("error", handleError);

    // loading events
    videoElement?.addEventListener("loadstart", handleLoading);
    videoElement?.addEventListener("waiting", handleLoading);
    videoElement?.addEventListener("stalled", handleLoading);

    // not loading events
    videoElement?.addEventListener("canplay", handleNotLoading);
    videoElement?.addEventListener("canplaythrough", handleNotLoading);

    return () => {
      videoElement?.removeEventListener("play", handlePlay);
      videoElement?.removeEventListener("pause", handlePause);
      videoElement?.removeEventListener("ended", handleEnded);
      videoElement?.removeEventListener("error", handleError);

      videoElement?.removeEventListener("loadstart", handleLoading);
      videoElement?.removeEventListener("waiting", handleLoading);
      videoElement?.removeEventListener("stalled", handleLoading);

      videoElement?.removeEventListener("canplay", handleNotLoading);
      videoElement?.removeEventListener("canplaythrough", handleNotLoading);
    };
  }, [props.src]);

  useEffect(() => {
    setAutoPlay(true);
  }, []);

  useEffect(() => {
    if (!mainDivRef.current || !isPlaying || !isHovering) {
      return;
    }

    // hide the cursor after 5 secs
    const seconds = 5;
    const mainDivElement = mainDivRef.current;

    let id: NodeJS.Timer;

    const hide = () => {
      setHidingControls(true);
      setHideCursor(true);
    };

    const resetTimeout = ({ showControls } = { showControls: true }) => {
      setHidingControls(false);
      setHideCursor(false);

      if (showControls) {
        setShowControls(true);
      }

      clearTimeout(id);

      id = setTimeout(hide, seconds * 1000);
    };

    const handleMouseMove = () => resetTimeout();
    const handleClick = () => resetTimeout({ showControls: false });

    id = setTimeout(hide, seconds * 1000);

    mainDivElement.addEventListener("mousemove", handleMouseMove);
    mainDivElement.addEventListener("click", handleClick);

    return () => {
      mainDivElement.removeEventListener("mousemove", handleMouseMove);
      mainDivElement.removeEventListener("click", handleClick);

      clearTimeout(id);
      setHideCursor(false);
    };
  }, [isPlaying, isHovering]);

  const handleMouseEnter = () => {
    setHidingControls(false);
    setShowControls(true);

    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setHidingControls(true);
    }

    setIsHovering(false);
  };

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

  const isDoubleClickRef = useRef(false);

  const handleVideoClick = async (event: React.MouseEvent) => {
    // more than 1 click
    if (event.detail > 1) {
      isDoubleClickRef.current = true;
      setTimeout(() => (isDoubleClickRef.current = false), 700);

      return;
    }

    // wait 200 milliseconds to check if it's a double click
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (isDoubleClickRef.current) {
      return;
    }

    if (showControls) {
      handlePlayToggle();
    } else {
      setShowControls(true);
    }
  };

  return (
    <div
      ref={mainDivRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group/player z-[1] bg-black ${
        hideCursor ? "cursor-none" : "cursor-auto"
      } ${
        props.isFullscreen
          ? "fixed inset-0"
          : "sticky top-0 h-80 w-full landscape:relative " +
            (props.smolMode
              ? "lg:aspect-video lg:h-auto lg:max-h-[min(960px,80vh)] lg:min-h-[360px] lg:w-1/2 lg:max-w-[1280px]"
              : "lg:relative lg:h-[80vh]")
      }`}
    >
      <video
        autoPlay={autoPlay}
        loop={loop}
        ref={videoRef}
        src={props.src}
        onClick={handleVideoClick}
        onDoubleClick={props.onFullscreenToggle}
        onContextMenu={handleContextMenu}
        className={`${error ? "hidden" : "block"} mx-auto h-full`}
      />

      {loading && !error && (
        <LoadingOutlined
          style={{ color }}
          className="absolute right-[calc(50%-calc(6rem*0.5))] top-[calc(50%-calc(6rem*0.5))] text-[6rem] text-miku-2"
        />
      )}

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
        <HeartFilled style={{ color }} className="text-miku-3" /> Mikus
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
        } absolute bottom-0 left-0 right-0 mx-0 flex-col gap-4 bg-gradient-to-t from-black/90 to-transparent px-8 py-2`}
      >
        {props.isFullscreen && (
          <Button
            aria-label="open playlist"
            onClick={props.onPlaylistOpen}
            className="fixed left-0 top-0 m-4 p-2 [&:not(:hover)]:!bg-black/25"
          >
            <MenuOutlined />
          </Button>
        )}

        <ProgressBarProvider>
          <ProgressBar videoRef={videoRef} isPlaying={isPlaying} />

          <div className="flex items-center justify-between">
            <TimeVisualizer videoRef={videoRef} />

            <div className="flex gap-1">
              {props.previousHref && (
                <Button aria-label="previous video" href={props.previousHref}>
                  <StepBackwardFilled />
                </Button>
              )}

              <Button
                aria-label={`${isPlaying ? "pause" : "play"} video`}
                onClick={handlePlayToggle}
              >
                {isPlaying ? <PauseOutlined /> : <CaretRightFilled />}
              </Button>

              {props.nextHref && (
                <Button aria-label="next video" href={props.nextHref}>
                  <StepForwardFilled />
                </Button>
              )}
            </div>

            <div className="flex gap-1">
              <Button
                aria-label={`${loop ? "disable" : "enable"} loop`}
                className={loop ? "" : "text-slate-400"}
                onClick={handleLoopToggle}
              >
                <RetweetOutlined />
              </Button>
              <Button
                aria-label={props.smolMode ? "Default view" : "Smol mode"}
                onClick={props.onSmolModeToggle}
                className={props.isFullscreen ? "hidden" : "hidden lg:flex"}
              >
                {props.smolMode ? (
                  <PlusSquareOutlined />
                ) : (
                  <MinusSquareOutlined />
                )}
              </Button>
              <Sound videoRef={videoRef} />
              <Button
                aria-label={`${
                  props.isFullscreen ? "exit" : "enter"
                } fullscreen mode`}
                onClick={props.onFullscreenToggle}
              >
                {props.isFullscreen ? (
                  <FullscreenExitOutlined />
                ) : (
                  <FullscreenOutlined />
                )}
              </Button>
            </div>
          </div>
        </ProgressBarProvider>
      </div>
    </div>
  );
};

export default VideoPlayer;
