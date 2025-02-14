/* eslint-disable @typescript-eslint/ban-ts-comment */
import ytdl, { videoInfo } from "@distube/ytdl-core";
import { ffmpegPath } from "./ffmpeg";
import queue from "./queue";
import { getSelectedFolder } from "../settings";
import cp from "child_process";

const downloadVideo = (
  event: Electron.IpcMainEvent,
  videoInfo: videoInfo,
  quality: string,
  duration: string,
  thumbnail: string,
  title: string,
  audioQuality: string,
  totalSize: string
): void => {
  const defaultPath = getSelectedFolder();

  const qualityInt = parseInt(quality);

  const name = title.replace(/[^a-z0-9]/gi, "_").toLowerCase() + "_" + Date.now();

  const chooseFormat = ytdl.chooseFormat(videoInfo.formats, { quality: qualityInt });

  event.sender.send("video-details", {
    id: name,
    title: title,
    thumbnail: thumbnail,
    duration: duration,
    progress: 0,
    filePath: `${defaultPath}/${name}.mp4`,
    format: "mp4",
    quality: `${chooseFormat.qualityLabel}`,
    totalSize: totalSize,
    channel: videoInfo.videoDetails.author.name
  });

  queue.push(() => {
    return new Promise((resolve, reject) => {
      downloadYoutubeVideoFFMPEG(videoInfo, defaultPath, name, qualityInt, event, audioQuality)
        .then((path) => {
          resolve(path);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

const downloadYoutubeVideoFFMPEG = (
  infos: ytdl.videoInfo,
  path: string,
  name: string,
  itag: number,
  event: Electron.IpcMainEvent,
  audioQuality: string
): Promise<string> => {
  const ffmpeg = ffmpegPath;

  return new Promise((resolve, reject) => {
    const tracker = {
      start: Date.now(),
      audio: { downloaded: 0, total: Infinity },
      video: { downloaded: 0, total: Infinity },
      merged: { frame: 0, speed: "0x", fps: 0 }
    };

    const audio = ytdl
      .downloadFromInfo(infos, { quality: audioQuality })
      .on("progress", (_, downloaded, total) => {
        tracker.audio = { downloaded, total };
      });

    const video = ytdl
      .downloadFromInfo(infos, {
        filter(format) {
          return format.itag === itag;
        }
      })
      .on("progress", (_, downloaded, total) => {
        tracker.video = { downloaded, total };
      });

    // Start the ffmpeg child process
    const ffmpegProcess = cp.spawn(
      ffmpeg,
      [
        // Remove ffmpeg's console spamming
        "-loglevel",
        "8",
        "-hide_banner",
        // Redirect/Enable progress messages
        "-progress",
        "pipe:3",
        // Set inputs
        "-i",
        "pipe:4",
        "-i",
        "pipe:5",
        // Map audio & video from streams
        "-map",
        "0:a",
        "-map",
        "1:v",
        // Keep encoding
        "-c:v",
        "copy",
        // Define output file
        `${path}/${name}.mp4`
      ],
      {
        windowsHide: true,
        stdio: [
          /* Standard: stdin, stdout, stderr */
          "inherit",
          "inherit",
          "inherit",
          /* Custom: pipe:3, pipe:4, pipe:5 */
          "pipe",
          "pipe",
          "pipe"
        ]
      }
    );
    ffmpegProcess.on("close", (code) => {
      console.log("done");
      // Cleanup
      process.stdout.write("\n\n\n\n");

      if (code === 0) {
        event.sender.send("download-progress", { id: name, percent: 100 });
        resolve("Successfully merged " + name + ".mp4");
      } else {
        reject("Error while merging with ffmpeg");
      }
    });

    // Link streams
    // FFmpeg creates the transformer streams and we just have to insert / read data

    //@ts-ignore
    ffmpegProcess.stdio[3].on("data", (chunk) => {
      const lines = chunk.toString().trim().split("\n");
      const args = {};
      for (const l of lines) {
        const [key, value] = l.split("=");
        args[key.trim()] = value.trim();
      }
      //@ts-ignore
      tracker.merged = args;

      const percent = calculateTotalPercentage(tracker, tracker.start);

      event.sender.send("download-progress", { id: name, percent: percent.toFixed(2) });
    });

    //@ts-ignore
    audio.pipe(ffmpegProcess.stdio[4]);
    //@ts-ignore
    video.pipe(ffmpegProcess.stdio[5]);
  });
};

const calculateTotalPercentage = (tracker, startTime): number => {
  const totalDownloaded = tracker.audio.downloaded + tracker.video.downloaded;
  const totalSize = tracker.audio.total + tracker.video.total;
  const percentDownloaded = (totalDownloaded / totalSize) * 100;

  const audioSpeed = tracker.audio.downloaded / ((Date.now() - startTime) / 1000);
  const videoSpeed = tracker.video.downloaded / ((Date.now() - startTime) / 1000);

  const estimatedTotalSize = totalSize;

  const estimatedTotalTimeInSeconds = estimatedTotalSize / ((audioSpeed + videoSpeed) / 2);

  const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;
  const percentMerged = (elapsedTimeInSeconds / estimatedTotalTimeInSeconds) * 100;

  const totalPercentage = (percentDownloaded + percentMerged) / 2;

  return totalPercentage;
};

export default downloadVideo;
