import fmpegPath from "@ffmpeg-installer/ffmpeg";
import electronIsDev from "electron-is-dev";

const paths = {
  ffmpeg: fmpegPath.path
};

if (!electronIsDev) {
  const fixPath = (path: string): string => path.replace("app.asar", "app.asar.unpacked");
  paths.ffmpeg = fixPath(paths.ffmpeg);
}

//ffmpeg.setFfmpegPath(paths.ffmpeg);

export const ffmpegPath = paths.ffmpeg;

//export default ffmpeg;
