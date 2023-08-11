import ytdl from "ytdl-core";

export default (url: string): boolean => {
  return ytdl.validateURL(url);
};
