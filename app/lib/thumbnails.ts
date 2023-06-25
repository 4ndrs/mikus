import path from "node:path";
import { spawnSync } from "node:child_process";

const generateThumbnail = (filename: string) => {
  const filePath = path.join("public", filename);

  const process = spawnSync("ffmpeg", ["-hide_banner", "-i", filePath], {
    encoding: "utf8",
  });

  return `stderr: ${process.stderr} :: error: ${process.error?.message}`;
};

export { generateThumbnail };
