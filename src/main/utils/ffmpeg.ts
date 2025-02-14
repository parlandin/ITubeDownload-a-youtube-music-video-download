import fmpegPath from "ffmpeg-static";
import { is } from "@electron-toolkit/utils";

const paths = {
  ffmpeg: fmpegPath || ""
};

if (!is.dev) {
  const fixPath = (path: string): string => path.replace("app.asar", "app.asar.unpacked");
  paths.ffmpeg = fixPath(paths.ffmpeg);
}

if (is.dev) {
  console.log("ffmpeg path: ", paths.ffmpeg);
}

//ffmpeg.setFfmpegPath(paths.ffmpeg);

export const ffmpegPath = paths.ffmpeg;

//export default ffmpeg;
