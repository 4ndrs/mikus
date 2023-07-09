import { useState } from "react";
import { useColor } from "@/app/context";

import Link from "@/app/components/link";

type Props = React.ComponentProps<"button"> | React.ComponentProps<typeof Link>;

const Button = ({ children, className, ...props }: Props) => {
  const [hovering, setHovering] = useState(false);

  const color = useColor();

  const handleEnter = () => {
    if (color) {
      setHovering(true);
    }
  };

  const handleLeave = () => {
    setHovering(false);
  };

  return (
    <div className="text-[1.5rem] text-white">
      {!("href" in props) ? (
        <button
          {...props}
          onPointerEnter={handleEnter}
          onPointerLeave={handleLeave}
          style={{
            backgroundColor: color ? color + (hovering ? "4d" : "00") : "",
          }}
          className={
            (className || "") +
            " flex items-center rounded-full bg-miku-3 bg-opacity-0 p-1 outline-none ring-miku-3/80 transition-colors duration-200 ease-in-out hover:bg-opacity-30 focus-visible:ring"
          }
        >
          {children}
        </button>
      ) : (
        <Link
          {...props}
          onPointerEnter={handleEnter}
          onPointerLeave={handleLeave}
          style={{
            backgroundColor: color ? color + (hovering ? "4d" : "00") : "",
          }}
          className={
            (className || "") +
            " flex items-center rounded-full bg-miku-3 bg-opacity-0 p-1 outline-none ring-miku-3/80 transition-colors duration-200 ease-in-out hover:bg-opacity-30 focus-visible:ring"
          }
        >
          {children}
        </Link>
      )}
    </div>
  );
};

export default Button;
