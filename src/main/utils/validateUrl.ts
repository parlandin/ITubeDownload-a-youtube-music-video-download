import ytdl from "@distube/ytdl-core";

export default (url: string): boolean => {
  return ytdl.validateURL(url);
};
