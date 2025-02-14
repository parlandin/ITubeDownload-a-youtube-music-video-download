import ytdl, { videoInfo } from "@distube/ytdl-core";
import { ffmpegPath } from "./ffmpeg";
import queue from "./queue";
import { getSelectedFolder } from "../settings";
import cp from "child_process";

interface ProgressTracker {
  start: number;
  audio: {
    downloaded: number;
    total: number;
  };
  video: {
    downloaded: number;
    total: number;
  };
  merged: {
    frame: number;
    speed: string;
    fps: number;
    progress: number;
  };
}

class VideoProcessor {
  private readonly event: Electron.IpcMainEvent;
  private readonly videoInfo: videoInfo;
  private readonly outputPath: string;
  private readonly videoName: string;
  private readonly qualityItag: number;
  private readonly audioQuality: string;
  private readonly totalFrames: number;

  constructor(
    event: Electron.IpcMainEvent,
    videoInfo: videoInfo,
    outputPath: string,
    videoName: string,
    qualityItag: number,
    audioQuality: string
  ) {
    this.event = event;
    this.videoInfo = videoInfo;
    this.outputPath = outputPath;
    this.videoName = videoName;
    this.qualityItag = qualityItag;
    this.audioQuality = audioQuality;
    this.totalFrames = this.calculateTotalFrames();
  }

  private calculateTotalFrames(): number {
    const duration = parseInt(this.videoInfo.videoDetails.lengthSeconds);
    const estimatedFps = 30;
    return duration * estimatedFps;
  }

  private createProgressTracker(): ProgressTracker {
    return {
      start: Date.now(),
      audio: { downloaded: 0, total: Infinity },
      video: { downloaded: 0, total: Infinity },
      merged: { frame: 0, speed: "0x", fps: 0, progress: 0 }
    };
  }

  private updateProgress(tracker: ProgressTracker): void {
    const percent = this.calculateTotalPercentage(tracker);
    this.event.sender.send("download-progress", {
      id: this.videoName,
      percent: Math.min(percent, 99.9)
    });
  }

  private calculateTotalPercentage(tracker: ProgressTracker): number {
    // Download progress (50% of total)
    const totalDownloaded = tracker.audio.downloaded + tracker.video.downloaded;
    const totalSize = tracker.audio.total + tracker.video.total;
    const downloadProgress = (totalDownloaded / totalSize) * 100;

    const mergeProgress = tracker.merged.progress || 0;

    return downloadProgress * 0.5 + mergeProgress * 0.5;
  }

  public async process(): Promise<string> {
    const tracker = this.createProgressTracker();

    return new Promise((resolve, reject) => {
      const audio = ytdl
        .downloadFromInfo(this.videoInfo, { quality: this.audioQuality })
        .on("progress", (_, downloaded, total) => {
          tracker.audio = { downloaded, total };
          this.updateProgress(tracker);
        });

      const video = ytdl
        .downloadFromInfo(this.videoInfo, {
          filter: (format) => format.itag === this.qualityItag
        })
        .on("progress", (_, downloaded, total) => {
          tracker.video = { downloaded, total };
          this.updateProgress(tracker);
        });

      // Setup FFmpeg
      const ffmpegProcess = cp.spawn(
        ffmpegPath,
        [
          "-loglevel",
          "8",
          "-hide_banner",
          "-progress",
          "pipe:3",
          "-i",
          "pipe:4",
          "-i",
          "pipe:5",
          "-map",
          "0:a",
          "-map",
          "1:v",
          "-c:v",
          "copy",
          `${this.outputPath}/${this.videoName}.mp4`
        ],
        {
          windowsHide: true,
          stdio: ["inherit", "inherit", "inherit", "pipe", "pipe", "pipe"]
        }
      );

      ffmpegProcess.on("close", (code) => {
        if (code === 0) {
          this.event.sender.send("download-progress", {
            id: this.videoName,
            percent: 100
          });
          resolve(`Successfully merged ${this.videoName}.mp4`);
        } else {
          reject("Error while merging with ffmpeg");
        }
      });

      //@ts-ignore this is valid
      ffmpegProcess.stdio[3].on("data", (chunk) => {
        const lines = chunk.toString().trim().split("\n");
        const args = Object.fromEntries(
          lines.map((line) => {
            const [key, value] = line.split("=");
            return [key.trim(), value.trim()];
          })
        );

        //@ts-ignore this is valid
        tracker.merged = { ...args, progress: 0 };

        if (args.frame) {
          const currentFrame = parseInt(args.frame);
          tracker.merged.progress = (currentFrame / this.totalFrames) * 100;
        }

        this.updateProgress(tracker);
      });

      //@ts-ignore this is valid
      audio.pipe(ffmpegProcess.stdio[4]);
      //@ts-ignore this is valid
      video.pipe(ffmpegProcess.stdio[5]);
    });
  }
}

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
  const videoName = title.replace(/[^a-z0-9]/gi, "_").toLowerCase() + "_" + Date.now();
  const chooseFormat = ytdl.chooseFormat(videoInfo.formats, { quality: qualityInt });

  event.sender.send("video-details", {
    id: videoName,
    title: title,
    thumbnail: thumbnail,
    duration: duration,
    progress: 0,
    filePath: `${defaultPath}/${videoName}.mp4`,
    format: "mp4",
    quality: `${chooseFormat.qualityLabel}`,
    totalSize: totalSize,
    channel: videoInfo.videoDetails.author.name
  });

  queue.push(() => {
    return new Promise((resolve, reject) => {
      const processor = new VideoProcessor(
        event,
        videoInfo,
        defaultPath,
        videoName,
        qualityInt,
        audioQuality
      );

      processor.process().then(resolve).catch(reject);
    });
  });
};

export default downloadVideo;
