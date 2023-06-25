import { spawnSync } from "child_process";
import { readdirSync, statSync } from "fs";

import path from "path";

const generateThumbnails = () => {
  const directory = "public";

  const files = readdirSync(directory).filter(
    (file) =>
      statSync(path.join(directory, file)).isFile() &&
      !file.includes(".thumbnail.png")
  );

  files.forEach((file) =>
    spawnSync("ffmpeg", [
      "-hide_banner",
      "-i",
      path.join(directory, file),
      "-map",
      "0:v",
      "-v:frames",
      "1",
      "-vf",
      "scale=-1:128:flags=lanczos",
      `${path.join(directory, path.parse(file).name)}.thumbnail.png`,
      "-n",
    ])
  );
};

export { generateThumbnails };
