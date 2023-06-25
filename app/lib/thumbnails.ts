import { spawnSync } from "node:child_process";

const generateThumbnail = (_filename: string) => {
  const process = spawnSync("ls", ["public/"], { encoding: "utf8" });

  if (process.status === 2) {
    throw new Error(process.stderr);
  }

  return process.stdout + ` ${Date.now()}`;
};

export { generateThumbnail };
