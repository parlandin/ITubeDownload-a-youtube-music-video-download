import ytdl, { videoInfo } from "ytdl-core";
import ffmpeg from "./ffmpeg";
import queue from "./queue";
import { getStore } from "../settings";

const downloadAudio = (
  event: Electron.IpcMainEvent,
  videoInfo: videoInfo,
  quality: string,
  duration: string,
  thumbnail: string,
  title: string
): void => {
  const defaultPath = (getStore("settings") as { selectedFolder: string | undefined })
    .selectedFolder;

  const qualityInt = parseInt(quality);

  const chooseFormat = ytdl.chooseFormat(videoInfo.formats, { quality: qualityInt });

  const name = title.replace(/[^a-z0-9]/gi, "_").toLowerCase() + "_" + Date.now();

  event.sender.send("video-details", {
    id: name,
    title: title,
    thumbnail: thumbnail,
    duration: duration,
    progress: 0
  });

  queue.push(() => {
    return new Promise((resolve, reject) => {
      const stream = ytdl.downloadFromInfo(videoInfo, {
        filter(format) {
          return format.itag == qualityInt;
        }
      });

      let totalTime = 0;
      const ffmpegProcess = ffmpeg(stream)
        .audioBitrate(chooseFormat.audioBitrate || 128)
        .save(`${defaultPath}/${name}.mp3`)
        .on("codecData", (data) => {
          totalTime = parseInt(data.duration.replace(/:/g, ""));
        })
        .on("progress", (progress) => {
          const time = parseInt(progress.timemark.replace(/:/g, ""));
          const percent = (time / totalTime) * 100;

          event.sender.send("download-progress", { id: name, percent: percent });
        })
        .on("end", () => {
          resolve(`${defaultPath}/${name}.mp3`);
        })
        .on("error", (err) => {
          console.error(err);
          event.sender.send("download-error", err);
          reject(err);
        });
      ffmpegProcess.run();
    });
  });
};

export default downloadAudio;
