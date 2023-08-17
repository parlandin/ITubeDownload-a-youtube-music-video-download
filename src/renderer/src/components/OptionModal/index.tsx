import { IFormatInfo, VideoInfo } from "@pages/home";
import * as S from "./styles";
import { useEffect, useState } from "react";
import DownloadIcon from "@components/DownloadIcon";
import SpinnerIcon from "@components/SpinnerIcon";

type OptionModalProps = {
  visible?: boolean;
  close: () => void;
  data?: VideoInfo;
  isPending?: boolean;
};

enum FileType {
  audio = "audio",
  video = "video",
  videoOutAudio = "videoOutAudio"
}

const OptionModal: React.FC<OptionModalProps> = ({ visible, close, data, isPending }) => {
  const [currentType, setCurrentType] = useState<FileType>(FileType.audio);
  const [currentFormat, setCurrentFormat] = useState<"mp4" | "mp3">("mp3");
  const [currentListOfFiles, setCurrentListOfFiles] = useState<IFormatInfo[] | []>([]);
  const [checkedValue, setCheckedValue] = useState<string>("");

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value as FileType;
    setCurrentType(value);

    if (value === FileType.audio) {
      setCurrentFormat("mp3");
      return;
    }

    setCurrentFormat("mp4");
  };

  const handleCheckedValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCheckedValue(e.target.value);
  };

  const formatCodecs = (input: string): string[] | [] => {
    const regex = /\/(\w+);\scodecs="([^"]+)"/;

    const match = input.match(regex);
    if (match) {
      return [match[1], match[2]];
    }

    return [];
  };

  useEffect(() => {
    if (data) {
      setCheckedValue("");
      if (currentType === FileType.audio) {
        setCurrentListOfFiles(data.listOfAudioInfos);
        return;
      }

      setCurrentListOfFiles(data.listOfVideoInfos);
    }
  }, [currentType, data]);

  const handleOnClickDownload = (): void => {
    if (!data) return;

    const filtedFiles = currentListOfFiles.filter(
      (item: IFormatInfo) => item.itag === parseInt(checkedValue)
    );

    const dataAudio = {
      videoInfos: data.formats,
      quality: checkedValue,
      duration: data.duration,
      thumbnail: data.thumbnail,
      title: data.title,
      totalSize: filtedFiles[0].totalSizeMB
    };

    if (currentType === FileType.audio) {
      window.api.youtube.downloadAudio(dataAudio);
    }

    if (currentType === FileType.video) {
      let audioQuality: string | undefined = undefined;
      currentListOfFiles.forEach((item: IFormatInfo) => {
        if (item.itag === parseInt(checkedValue)) {
          audioQuality = item.audioQuality;
        }
      });

      const dataVideo = {
        ...dataAudio,
        audioQuality: audioQuality
      };

      window.api.youtube.downloadVideo(dataVideo);
    }

    if (currentType === FileType.videoOutAudio) {
      alert("Essa opção ainda não está disponível");
    }

    close();
  };

  return (
    <>
      {visible && (
        <>
          <S.BackgroundOverlay />
          <S.Container>
            <S.Header>
              <S.Title>Baixar vídeo</S.Title>
              <S.CloseButton onClick={close} title="close">
                &#10006;
              </S.CloseButton>
            </S.Header>

            {isPending ? (
              <S.PendingMessage>
                Coletando informações do vídeo <SpinnerIcon />
              </S.PendingMessage>
            ) : (
              <>
                <S.VideoContainer>
                  <S.VideoThumbnail>
                    <img src={data?.thumbnail} alt="" />
                  </S.VideoThumbnail>

                  <S.VideoDetails>
                    <S.VideoTitle>{data?.title}</S.VideoTitle>
                    <S.VideoDuration>{data?.duration} minutos</S.VideoDuration>
                  </S.VideoDetails>
                </S.VideoContainer>

                <S.TypeSelectorContainer>
                  <S.TypeSelector>
                    <S.TypeSelectorLabel>Tipo</S.TypeSelectorLabel>
                    <S.ChooseType value={currentType} onChange={handleTypeChange}>
                      <option value="audio">Audio</option>
                      <option value="video">Vídeo</option>
                      <option value="videoOutAudio">Vídeo Sem Audio</option>
                    </S.ChooseType>
                  </S.TypeSelector>

                  <S.TypeSelector>
                    <S.TypeSelectorLabel>Formato</S.TypeSelectorLabel>
                    <S.ChooseType disabled value={currentFormat}>
                      <option value="mp3">mp3</option>
                      <option value="mp4">mp4</option>
                    </S.ChooseType>
                  </S.TypeSelector>
                </S.TypeSelectorContainer>

                <S.ListToDownloadContainer>
                  <S.ListToDownloadHeader>
                    <S.ListToDownloadTitle>Qualidade</S.ListToDownloadTitle>
                    <S.ListToDownloadTitle>Codecs de {currentType}</S.ListToDownloadTitle>
                    <S.ListToDownloadTitle>Tamanho aproximado</S.ListToDownloadTitle>
                  </S.ListToDownloadHeader>

                  <S.ListToDownloadBody>
                    {currentListOfFiles.map((item: IFormatInfo) => {
                      const { VideoQuality, mimeType, audioBitrate, itag, totalSizeMB, sizeMB } =
                        item;
                      const codecs = formatCodecs(mimeType as string);

                      return (
                        <S.ListToDownloadItem key={itag}>
                          <S.ListToDownloadGeneric>
                            <S.ListToDownloadItemInput className="radio">
                              <input
                                name="download"
                                type="radio"
                                value={itag}
                                checked={checkedValue == `${itag}`}
                                onChange={handleCheckedValue}
                              />
                              <span></span>
                            </S.ListToDownloadItemInput>
                            <p className="quality">
                              {currentType == FileType.audio ? `${audioBitrate}kbps` : VideoQuality}
                            </p>
                          </S.ListToDownloadGeneric>
                          <S.ListToDownloadItemText className="codec">
                            {/*  {mimeType} */}
                            {codecs.length > 0 && ` ${codecs[0]} • ${codecs[1]}`}
                          </S.ListToDownloadItemText>
                          <S.ListToDownloadItemText>
                            {currentType == FileType.videoOutAudio ? sizeMB : totalSizeMB}
                          </S.ListToDownloadItemText>
                        </S.ListToDownloadItem>
                      );
                    })}

                    {currentListOfFiles.length === 0 && <p>nenhum arquivo encontrado</p>}
                  </S.ListToDownloadBody>
                </S.ListToDownloadContainer>

                <S.DownloadContainer>
                  {checkedValue && (
                    <S.DownloadButton disabled={!checkedValue} onClick={handleOnClickDownload}>
                      Baixar <DownloadIcon />
                    </S.DownloadButton>
                  )}
                </S.DownloadContainer>
              </>
            )}
          </S.Container>
        </>
      )}
    </>
  );
};

export default OptionModal;
