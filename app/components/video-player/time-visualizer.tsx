import { useProgressBar } from "@/app/context";
import { useDuration } from "@/app/hooks";

type Props = { videoRef: React.RefObject<HTMLVideoElement> };

const TimeVisualizer = ({ videoRef }: Props) => {
  const duration = useDuration(videoRef);

  const { current } = useProgressBar();

  const parseTime = (seconds: number) =>
    `${("0" + Math.floor((seconds || 0) / 60)).slice(-2)}:${(
      "0" + Math.floor((seconds || 0) % 60)
    ).slice(-2)}`;

  return (
    <div className="flex text-[1rem] text-white">
      <div className="w-[3.1rem]">{parseTime(current)}</div>{" "}
      <div className="hidden md:block">/ </div>
      <div className="hidden w-[3.1rem] text-right md:block">
        {parseTime(duration)}
      </div>
    </div>
  );
};

export default TimeVisualizer;
