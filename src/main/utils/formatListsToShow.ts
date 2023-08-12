import ytdl from "ytdl-core";
import getListOfVideoInfos, { IFormatInfo } from "./getListOfVideoInfos";

export interface IFormattedReturn {
  title: string;
  thumbnail: string | undefined;
  duration: string;
  listOfVideoInfos: IFormatInfo[];
  listOfAudioInfos: IFormatInfo[];
  formats: ytdl.videoInfo;
}

const formatListsToShow = async (url: string): Promise<IFormattedReturn> => {
  const infos = await getListOfVideoInfos(url);
  const { videoDetails } = infos.allInfos;

  const { title, thumbnails } = videoDetails;
  const thumbnail = thumbnails?.at(0)?.url;
  return {
    title,
    thumbnail,
    duration: infos.listOfAudioInfos[0].duration,
    listOfVideoInfos: infos.listOfVideoInfos,
    listOfAudioInfos: infos.listOfAudioInfos,
    formats: infos.allInfos
  };
};

export default formatListsToShow;
