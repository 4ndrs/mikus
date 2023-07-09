"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const RouteStatus = () => {
  const [loaded, setLoaded] = useState(0);
  const [hidden, setHidden] = useState(true);

  const searchParams = useSearchParams();

  useEffect(() => {
    let id: NodeJS.Timer;

    if (loaded === 100) {
      id = setTimeout(() => {
        setHidden(true);
        setLoaded(0);
      }, 500);
    }

    return () => clearTimeout(id);
  }, [loaded]);

  useEffect(() => {
    let id: NodeJS.Timer;

    const handleTouchedLink = (event: CustomEvent<string>) => {
      const params = new URL(document.location.href).searchParams;
      const match = event.detail.match(/v=([^&]+)/);

      if (!match || match[1] === params.get("v")) {
        // do nothing if same video url as current
        return;
      }

      setHidden(false);
      setLoaded(30);

      id = setInterval(
        () =>
          setLoaded((loaded) => {
            if (loaded > 70) {
              clearInterval(id);
              return loaded;
            }

            return loaded + 1;
          }),
        50
      );
    };

    // no event listener types for CustomEvent in lib.dom
    // https://github.com/microsoft/TypeScript/issues/28357
    window.addEventListener("touchedlink", handleTouchedLink as EventListener);

    setLoaded(100);

    return () => {
      clearInterval(id);

      window.removeEventListener(
        "touchedlink",
        handleTouchedLink as EventListener
      );
    };
  }, [searchParams]);

  return (
    <div
      aria-label="changing route"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={loaded}
      style={{ width: loaded + "%" }}
      className={`${
        hidden ? "hidden" : "block"
      } fixed inset-x-0 top-0 z-50 h-1 bg-miku-3 transition-[width] duration-500`}
    />
  );
};

export default RouteStatus;
