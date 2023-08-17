import ytdl, { videoInfo } from "ytdl-core";
import { ffmpegPath } from "./ffmpeg";
import queue from "./queue";
import { getSelectedFolder } from "../settings";
import { spawn } from "child_process";
import { Readable } from "stream";

const downloadAudio = (
  event: Electron.IpcMainEvent,
  videoInfo: videoInfo,
  quality: string,
  duration: string,
  thumbnail: string,
  title: string,
  totalSize: string
): void => {
  const defaultPath = getSelectedFolder();

  const qualityInt = parseInt(quality);

  const chooseFormat = ytdl.chooseFormat(videoInfo.formats, { quality: qualityInt });

  const name = title.replace(/[^a-z0-9]/gi, "_").toLowerCase() + "_" + Date.now();

  event.sender.send("video-details", {
    id: name,
    title: title,
    thumbnail: thumbnail,
    duration: duration,
    progress: 0,
    filePath: `${defaultPath}/${name}.mp3`,
    format: "mp3",
    quality: `${chooseFormat.audioBitrate}Kbps`,
    totalSize: totalSize,
    channel: videoInfo.videoDetails.author.name
  });

  queue.push(() => {
    return new Promise((resolve, reject) => {
      const stream = ytdl.downloadFromInfo(videoInfo, {
        filter(format) {
          return format.itag == qualityInt;
        }
      });

      const audioBitrate = chooseFormat.audioBitrate || 160;
      convertStreamToMP3(stream, defaultPath, name, audioBitrate, event)
        .then((path) => {
          resolve(path);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

function convertStreamToMP3(
  stream: Readable,
  defaultPath: string,
  name: string,
  audioBitrate: number,
  event: Electron.IpcMainEvent
): Promise<string> {
  return new Promise((resolve, reject) => {
    const inputOptions = [
      "-i",
      "pipe:0" // Input from pipe
    ];

    const outputOptions = [
      "-b:a",
      `${audioBitrate}k`, // Set audio bitrate
      `${defaultPath}/${name}.mp3` // Output file path
    ];

    const ffmpegProcess = spawn(ffmpegPath, [...inputOptions, ...outputOptions]);

    let totalTime = 0;

    ffmpegProcess.stderr.on("data", (data) => {
      const logMessage = data.toString();
      const durationMatch = logMessage.match(/Duration: (\d+):(\d+):(\d+)\.(\d+)/);
      if (durationMatch) {
        const hours = parseInt(durationMatch[1]);
        const minutes = parseInt(durationMatch[2]);
        const seconds = parseInt(durationMatch[3]);
        totalTime = hours * 3600 + minutes * 60 + seconds;
      }

      const progressMatch = logMessage.match(/time=(\d+):(\d+):(\d+)\.(\d+)/);
      if (progressMatch) {
        const hours = parseInt(progressMatch[1]);
        const minutes = parseInt(progressMatch[2]);
        const seconds = parseInt(progressMatch[3]);
        const currentTime = hours * 3600 + minutes * 60 + seconds;
        const percent = (currentTime / totalTime) * 100;

        event.sender.send("download-progress", { id: name, percent: percent });
      }
    });

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        resolve(`${defaultPath}/${name}.mp3`);
      } else {
        const errorMessage = `FFmpeg process exited with code ${code}`;
        console.error(errorMessage);

        reject(errorMessage);
      }
    });

    ffmpegProcess.on("error", (err) => {
      console.error(err);
      event.sender.send("download-error", err);
      reject(err);
    });

    event.sender.send("download-progress", { id: name, percent: 0 });

    stream.pipe(ffmpegProcess.stdin);
  });
}

export default downloadAudio;
