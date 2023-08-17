import * as S from "./styles";
import ProgressBar from "@components/ProgressBar";
import useDownloads from "@renderer/hooks/useDownloads";

const DownloadsContainer: React.FC = () => {
  const { dataList, dataListComplete } = useDownloads();

  const handleOpenFolder = (filePath: string): (() => void) => {
    return async (): Promise<void> => {
      await window.api.youtube.getFilePath(filePath);
    };
  };

  return (
    <S.Container isContent={dataList.length > 0 || dataListComplete.length > 0}>
      {dataList.map((item) => {
        const isCompleted = item.progress == 100;

        return (
          <S.VideoContainer key={item.id}>
            <S.VideoThumbnail>
              <img src={item.thumbnail} alt="" />
            </S.VideoThumbnail>

            <S.VideoDetails>
              <S.VideoText className="title" title={item.title}>
                {item.title}
              </S.VideoText>

              <S.VideoText className="text duration">
                <S.ContentsInfos>
                  {item.duration} <S.Separator /> {item.totalSize} <S.Separator /> {item.format}
                  <S.Separator /> {item.quality} <S.Separator /> {item.channel}
                </S.ContentsInfos>
              </S.VideoText>

              <S.VideoText className="text download">
                <span>download{isCompleted ? "" : ":"}</span>
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

      {dataListComplete.map((item) => {
        const isCompleted = item.progress == 100;

        return (
          <S.VideoContainer key={item.id}>
            <S.VideoThumbnail>
              <img src={item.thumbnail} alt="" />
            </S.VideoThumbnail>

            <S.VideoDetails>
              <S.VideoText className="title" title={item.title}>
                {item.title}
              </S.VideoText>

              <S.VideoText className="text duration">
                <S.ContentsInfos>
                  {item.duration} <S.Separator /> {item.totalSize} <S.Separator /> {item.format}
                  <S.Separator /> {item.quality} <S.Separator /> {item.channel}
                </S.ContentsInfos>
              </S.VideoText>

              <S.FlipContainer>
                <div className="flipper">
                  <div className="card">
                    <S.VideoText className="text download">
                      <span>download{isCompleted ? "" : ":"}</span>
                      {!isCompleted ? (
                        <ProgressBar bgcolor="red" completed={item.progress} />
                      ) : (
                        "finalizado"
                      )}
                    </S.VideoText>
                  </div>

                  <div className="card back" title="Abri arquivo no reprodutor padrão">
                    <S.FilePath onClick={handleOpenFolder(item.filePath)}>
                      {item.filePath}
                    </S.FilePath>
                  </div>
                </div>
              </S.FlipContainer>
            </S.VideoDetails>
          </S.VideoContainer>
        );
      })}
    </S.Container>
  );
};

export default DownloadsContainer;
