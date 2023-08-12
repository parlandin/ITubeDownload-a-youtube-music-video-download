/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import * as S from "./styles";
import ProgressBar from "@components/ProgressBar";

type SimulateArray = {
  progress: number;
  id: string;
};

interface DataList {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  progress: number;
}

const DownloadsContainer: React.FC = () => {
  //const simulateArray: SimulateArray[] = [];
  const [simulateArray, setSimulateArray] = useState<SimulateArray[]>([]);
  const [dataList, setDataList] = useState<DataList[]>([]);

  function uniqueID(): string {
    return `${Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))}`;
  }

  const handleDownload = (): void => {
    const id = uniqueID();
    window.api.youtube.sendUrlToDownloading(`${id}`);
  };

  const setPercentOnDownload = (id: string, percent: number): void => {
    setDataList((prev) => {
      const newArray = prev.map((item) => {
        if (item.id === id) {
          return { ...item, progress: percent };
        }
        return item;
      });
      return newArray;
    });
  };

  useEffect(() => {
    if (!window) return;
    window.api.youtube.getPercent((data: any) => {
      //setDownloadPercent(parseFloat(percent.toFixed(2)));
      setPercentOnDownload(data.id, data.percent);
    });

    window.api.youtube.getVideoInfos((infos: any) => {
      console.log(infos);
      //setSimulateArray((prev) => [...prev, { progress: infos.percent, id: infos.id }]);
      setDataList((prev) => [...prev, infos]);
    });
  }, []);

  return (
    <S.Container isContent={dataList.length > 0}>
      {/*  <button onClick={handleDownload}>simular</button> */}
      {/*  <S.VideoContainer>
        <S.VideoThumbnail>
          <img
            src="https://i.ytimg.com/vi/j_KAOHosW3Y/hqdefault.jpg?sqp=-oaymwE1CKgBEF5IVfKriqkDKAgBFQAAiEIYAXABwAEG8AEB-AH8CYAC0AWKAgwIABABGCsgYShyMA8=&rs=AOn4CLB2qwHJInTSiaxEBZKqclSfadol4A"
            alt=""
          />
        </S.VideoThumbnail>

        <S.VideoDetails>
          <S.VideoText className="title">Running away to your own world ° a playlist</S.VideoText>
          <S.VideoText className="text">duração: {"4:13"} minutos</S.VideoText>
          <S.VideoText className="text download">
            <span>download:</span> <ProgressBar bgcolor="red" completed={10} />
          </S.VideoText>
        </S.VideoDetails>
      </S.VideoContainer> */}

      {dataList.map((item) => {
        const isCompleted = item.progress === 100;

        return (
          <S.VideoContainer key={item.id}>
            <S.VideoThumbnail>
              <img src={item.thumbnail} alt="" />
            </S.VideoThumbnail>

            <S.VideoDetails>
              <S.VideoText className="title">{item.title}</S.VideoText>
              <S.VideoText className="text">duração: {item.duration} minutos</S.VideoText>
              <S.VideoText className="text download">
                <span>download{isCompleted ? ":" : ""}</span>
                {!isCompleted ? (
                  <ProgressBar bgcolor="red" completed={item.progress} />
                ) : (
                  "finalizado"
                )}
              </S.VideoText>
            </S.VideoDetails>
          </S.VideoContainer>
        );
      })}
    </S.Container>
  );
};

export default DownloadsContainer;
