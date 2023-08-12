/* eslint-disable @typescript-eslint/ban-ts-comment */
import ytdl from "ytdl-core";
//import { app } from "electron";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import electronIsDev from "electron-is-dev";
//import { mainWindow } from "..";
//import getListOfVideoInfos, { FormatType } from "./getListOfVideoInfos";
//import fs, { unlink } from "fs";
//import cp, { ChildProcessWithoutNullStreams } from "child_process";
import cp from "child_process";
//import { Readable, Writable } from "stream";
//import formatListsToShow from "./formatListsToShow";
import queue from "./queue";

const paths = {
  ffmpeg: ffmpegPath.path
};

if (!electronIsDev) {
  const fixPath = (path: string): string => path.replace("app.asar", "app.asar.unpacked");
  paths.ffmpeg = fixPath(paths.ffmpeg);
}

ffmpeg.setFfmpegPath(paths.ffmpeg);

const downloadYoutube = (url: string, event: Electron.IpcMainEvent): Promise<string | unknown> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolveCb) => {
    event.sender.send("ffmpegPath", paths.ffmpeg);

    event.sender.send("video-details", { id: url, title: "title", thumbnail: "thumbnail" });

    queue.push(() => {
      return new Promise((resolve) => {
        let percent = 0;
        const time = setInterval(() => {
          percent += Math.floor(Math.random() * 10);
          event.sender.send("download-progress", {
            id: url,
            percent: percent >= 100 ? 100 : percent
          });
          downloadYoutubeVideoFFMPEG(url, "event", 255);

          if (percent >= 100) {
            clearInterval(time);
            resolveCb("done");
            resolve("done");
          }
        }, 500);
      });
    });

    /* let percent = 0;
    const time = setInterval(() => {
      percent += Math.floor(Math.random() * 10);
      event.sender.send("download-progress", { id: url, percent: percent >= 100 ? 100 : percent });

      if (percent >= 100) {
        clearInterval(time);
        resolveCb("done");
      }
    }, 500); */

    // eslint-disable-next-line prefer-const, @typescript-eslint/no-unused-vars
    //let totalTime = 0;

    //const infos = await ytdl.getInfo(url);
    //const infos = await getListOfVideoInfos(url);

    //const { videoDetails } = infos.allInfos;

    //console.log("list of formats: ", infos.listOfVideoInfos);

    //const { title, thumbnails, publishDate, category, lengthSeconds } = videoDetails;
    //const thumbnail = thumbnails?.at(-1)?.url;

    //event.sender.send("video-details", { title, thumbnail, publishDate, category, lengthSeconds });

    //const name = title.replace(/[^a-z0-9]/gi, "_").toLowerCase() + new Date().getTime();

    // const defaultPath = customPath ? customPath : app.getPath("music");

    //const format = ytdl.chooseFormat(infos.allInfos.formats, { quality: "250" });

    // downloadYoutubeVideo(url, `${defaultPath}/${name}`);
    //downloadYoutubeVideoFFMPEG(url, `${defaultPath}/${name}`, 136);

    //console.log("format: ", format);

    /*   const stream = ytdl.downloadFromInfo(infos.allInfos, {
      filter(format) {
        return format.itag === 250;
      }
    }); */

    /* const start = Date.now();
    const ffmpegProcess = ffmpeg(stream)
      .audioBitrate(format.audioBitrate || 128)
      .save(`${defaultPath}/${name}.mp3`)
      .on("codecData", (data) => {
        // HERE YOU GET THE TOTAL TIME
        totalTime = parseInt(data.duration.replace(/:/g, ""));
      })
      .on("progress", (progress) => {
        const time = parseInt(progress.timemark.replace(/:/g, ""));
        // AND HERE IS THE CALCULATION
        const percent = (time / totalTime) * 100;
        event.sender.send("download-progress", percent);

        mainWindow?.setProgressBar(percent / 100);
      })
      .on("end", () => {
        console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
        mainWindow?.setProgressBar(-1);
        resolve(`${defaultPath}/${name}.mp3`);
      })
      .on("error", (err) => {
        console.error(err);
        event.sender.send("download-error", err);
        reject(err);
      });
    ffmpegProcess.run(); */
  });
};

const downloadYoutubeVideoFFMPEG = (url: string, path: string, itag: number): void => {
  const ref = url;
  const ffmpeg = paths.ffmpeg;

  const tracker = {
    start: Date.now(),
    audio: { downloaded: 0, total: Infinity },
    video: { downloaded: 0, total: Infinity },
    merged: { frame: 0, speed: "0x", fps: 0 }
  };

  const audio = ytdl(ref, { quality: "highestaudio" }).on("progress", (_, downloaded, total) => {
    tracker.audio = { downloaded, total };
  });
  const video = ytdl(ref, {
    filter(format) {
      return format.itag === itag;
    }
  }).on("progress", (_, downloaded, total) => {
    tracker.video = { downloaded, total };
  });

  // Prepare the progress bar
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //const args = {};
  let progressbarHandle: null | NodeJS.Timer = null;
  const progressbarInterval = 1000;
  const showProgress = (): void => {
    const toMB = (i): string => (i / 1024 / 1024).toFixed(2);

    process.stdout.write(
      `Audio  | ${((tracker.audio.downloaded / tracker.audio.total) * 100).toFixed(2)}% processed `
    );
    process.stdout.write(
      `(${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB).${" ".repeat(10)}\n`
    );

    process.stdout.write(
      `Video  | ${((tracker.video.downloaded / tracker.video.total) * 100).toFixed(2)}% processed `
    );
    process.stdout.write(
      `(${toMB(tracker.video.downloaded)}MB of ${toMB(tracker.video.total)}MB).${" ".repeat(10)}\n`
    );

    process.stdout.write(`Merged | processing frame ${tracker.merged.frame} `);
    process.stdout.write(
      `(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${" ".repeat(10)}\n`
    );

    process.stdout.write(
      `running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`
    );
  };

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
      `${path}_out.mp4`
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
  ffmpegProcess.on("close", () => {
    console.log("done");
    // Cleanup
    process.stdout.write("\n\n\n\n");
    if (progressbarHandle != null) clearInterval(progressbarHandle);
  });

  // Link streams
  // FFmpeg creates the transformer streams and we just have to insert / read data

  //@ts-ignore
  ffmpegProcess.stdio[3].on("data", (chunk) => {
    // Start the progress bar
    if (!progressbarHandle) progressbarHandle = setInterval(showProgress, progressbarInterval);
    // Parse the param=value list returned by ffmpeg
    const lines = chunk.toString().trim().split("\n");
    const args = {};
    for (const l of lines) {
      const [key, value] = l.split("=");
      args[key.trim()] = value.trim();
    }
    //@ts-ignore
    tracker.merged = args;
  });
  //@ts-ignore
  audio.pipe(ffmpegProcess.stdio[4]);
  //@ts-ignore
  video.pipe(ffmpegProcess.stdio[5]);
};

export { downloadYoutube };
