import ytdl from "@distube/ytdl-core";
import { formatLink } from "./validateUrl";

export interface IFormatInfo {
  quality: string;
  itag: number;
  mimeType?: string;
  duration: string;
  sizeMB: string;
  hasVideo: boolean;
  hasAudioDefault: boolean;
  audioBitrate?: number;
  totalSizeMB: string;
  audioQuality?: string;
  VideoQuality?: string;
}

interface IListOfVideoInfos {
  listOfAudioInfos: IFormatInfo[];
  listOfVideoInfos: IFormatInfo[];
  allInfos: ytdl.videoInfo;
}

export enum FormatType {
  Audio = "audio",
  Video = "video"
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function sumFormattedBytes(...formattedValues: string[]): string {
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const sizeMap: Record<string, number> = {};

  formattedValues.forEach((formattedValue) => {
    const parts = formattedValue.split(" ");
    const value = parseFloat(parts[0]);
    const unit = parts[1];

    const index = sizes.indexOf(unit);
    if (index !== -1) {
      const bytes = value * Math.pow(k, index);
      sizeMap[unit] = (sizeMap[unit] || 0) + bytes;
    }
  });

  let totalBytes = 0;
  for (const unit in sizeMap) {
    totalBytes += sizeMap[unit];
  }

  let i = 0;
  while (totalBytes >= k) {
    totalBytes /= k;
    i++;
  }

  const dm = i === 0 ? 0 : 2;
  return totalBytes.toFixed(dm) + " " + sizes[i];
}

function formatDuration(durationMs: string): string {
  const totalSeconds = parseInt(durationMs) / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function extractFormatInfo(
  format: ytdl.videoFormat,
  type: FormatType,
  formats: ytdl.videoFormat[]
): IFormatInfo {
  const sizeMB = format.contentLength ? formatBytes(parseInt(format.contentLength)) : "N/A";

  const listOfQuality = [
    "480p",
    "480p60 HDR",
    "720p",
    "720p60",
    "720p60 HDR",
    "1080p",
    "1080p60",
    "1080p60 HDR",
    "1440p",
    "1440p60",
    "1440p60 HDR",
    "2160p",
    "2160p60",
    "2160p60 HDR",
    "4320p",
    "4320p60"
  ];

  let audioMb: string | undefined = undefined;
  let audio: ytdl.videoFormat | undefined = undefined;
  let audioQuality: string | undefined = undefined;

  if (type === FormatType.Video) {
    if (listOfQuality.includes(format.qualityLabel as string)) {
      audio = ytdl.chooseFormat(formats, { quality: "highestaudio" });
      audioQuality = "highestaudio";
    } else {
      audio = ytdl.chooseFormat(formats, { quality: "lowestaudio" });
      audioQuality = "lowestaudio";
    }
  }

  audioMb = audio?.contentLength ? formatBytes(parseInt(audio.contentLength)) : "0";

  return {
    VideoQuality: format.qualityLabel as string,
    quality: format.quality as string,
    itag: format.itag,
    mimeType: format.mimeType,
    duration: format.approxDurationMs ? formatDuration(format.approxDurationMs) : "N/A",
    sizeMB,
    totalSizeMB: audioMb ? sumFormattedBytes(audioMb, sizeMB) : "0",
    hasVideo: format.hasVideo,
    hasAudioDefault: format.hasAudio,
    audioBitrate: format.audioBitrate,
    audioQuality: audioQuality
  };
}

const getListOfVideoInfos = async (url: string): Promise<IListOfVideoInfos> => {
  const formatUrl = formatLink(url);

  console.log({ formatUrl });

  const infos = await ytdl.getInfo(formatUrl);

  const formatAudio = ytdl.filterFormats(infos.formats, "audioonly");
  const formatVideo = ytdl.filterFormats(infos.formats, "videoonly");

  const listOfVideos = formatVideo.map((format) =>
    extractFormatInfo(format, FormatType.Video, infos.formats)
  );
  const listOfAudios = formatAudio.map((format) =>
    extractFormatInfo(format, FormatType.Audio, infos.formats)
  );

  return { listOfAudioInfos: listOfAudios, listOfVideoInfos: listOfVideos, allInfos: infos };
};

export default getListOfVideoInfos;
