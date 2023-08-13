import { useEffect, useState } from "react";
import * as S from "./styles";
//import ProgressBar from "../ProgressBar";

interface videoInfos {
  title: string;
  thumbnail: string;
  publishDate: string;
  category: string;
  lengthSeconds: string;
}

//this a temporary component

const DownloadComponent = (): JSX.Element => {
  //const [urlInput, setUrlInput] = useState<string>("");
  //const [downloadPercent, setDownloadPercent] = useState<number>(0);
  const [videoTInfos, setVideoInfos] = useState<videoInfos>({
    title: "",
    thumbnail: "",
    publishDate: "",
    category: "",
    lengthSeconds: ""
  });
  //const [selectedFolder, setSelectedFolder] = useState<string>("");

  const handleUrlInput = (): void => {
    //setUrlInput(event.target.value);
  };

  const handleDownload = async (): Promise<void> => {
    //window.api.youtube.sendUrlToDownloading(urlInput, selectedFolder);
  };

  const getSelectedFolder = async (): Promise<void> => {
    //const selectedFolder = await window.api.youtube.getSelectedFolder();
    //setSelectedFolder(selectedFolder);
  };

  useEffect(() => {
    if (window) {
      /*  window.api.youtube.getPercent((percent: number) => {
        setDownloadPercent(parseFloat(percent.toFixed(2)));
      }); */

      window.api.youtube.getVideoInfos(
        ({ category, lengthSeconds, publishDate, thumbnail, title }) => {
          setVideoInfos({
            category,
            lengthSeconds,
            publishDate,
            thumbnail,
            title
          });
        }
      );

      window.api.youtube.downloadError((error: unknown) => {
        console.log(error);
      });

      window.api.youtube.getFfmpegPath((path: string) => {
        console.log("ffmep: " + path);
      });

      getSelectedFolder();
    }
  }, []);

  return (
    <S.Container>
      <S.Title>Baixar video</S.Title>
      <div>
        <label>Url do video</label>
        <input type="text" onChange={handleUrlInput} />
        <button onClick={handleDownload}>Download</button>
        {videoTInfos.title && (
          <S.Card>
            <S.Thumbnail>
              <img src={videoTInfos.thumbnail} alt="thumbnail" />
            </S.Thumbnail>

            <S.Infos>
              <S.Title>{videoTInfos.title}</S.Title>
              <S.Category>categoria: {videoTInfos.category}</S.Category>
              <S.LengthSeconds>
                {
                  //seconds to minutes
                  Math.floor(parseInt(videoTInfos.lengthSeconds) / 60) +
                    ":" +
                    (parseInt(videoTInfos.lengthSeconds) % 60) +
                    " minutos"
                }
              </S.LengthSeconds>
              <S.PublishDate>data de lançamento: {videoTInfos.publishDate}</S.PublishDate>
            </S.Infos>
          </S.Card>
        )}
        {/*  {downloadPercent > 0 && (
          <div>
            <ProgressBar bgcolor={"#2e0846"} completed={downloadPercent} />
          </div>
        )} */}
      </div>
    </S.Container>
  );
};

export default DownloadComponent;
