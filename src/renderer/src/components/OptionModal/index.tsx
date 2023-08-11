/* eslint-disable react/prop-types */
import { IFormatInfo, VideoInfo } from "@pages/home";
import * as S from "./styles";
import { useEffect, useState } from "react";

interface OptionModalProps {
  visible?: boolean;
  close?: () => void;
  data?: VideoInfo;
}

const OptionModal: React.FC<OptionModalProps> = ({ visible, close, data }) => {
  const [currentType, setCurrentType] = useState<"audio" | "video">("audio");
  const [currentFormat, setCurrentFormat] = useState<"mp4" | "mp3">("mp3");
  const [currentListOfFiles, setCurrentListOfFiles] = useState<IFormatInfo[] | []>([]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value as "audio" | "video";
    setCurrentType(value);

    if (value === "audio") {
      setCurrentFormat("mp3");
      setCurrentListOfFiles(data ? data.listOfAudioInfos : []);
      return;
    }

    setCurrentFormat("mp4");
    setCurrentListOfFiles(data ? data.listOfVideoInfos : []);
  };

  useEffect(() => {
    if (data) {
      if (currentType === "audio") {
        setCurrentListOfFiles(data.listOfAudioInfos);
        return;
      }

      setCurrentListOfFiles(data.listOfVideoInfos);
    }
  }, [currentType, data]);

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
                {/* <S.ListToDownloadItem>
                  <S.ListToDownloadGeneric>
                    <S.ListToDownloadItemInput className="radio">
                      <input name="download" type="radio" checked />
                      <span></span>
                    </S.ListToDownloadItemInput>
                    <p>1080p</p>
                  </S.ListToDownloadGeneric>
                  <S.ListToDownloadItemText>audio/webm</S.ListToDownloadItemText>
                  <S.ListToDownloadItemText>3.45MB</S.ListToDownloadItemText>
                </S.ListToDownloadItem> */}

                {currentListOfFiles.map((item, index) => {
                  const { VideoQuality, mimeType, audioBitrate, itag, totalSizeMB } = item;

                  return (
                    <S.ListToDownloadItem key={itag}>
                      <S.ListToDownloadGeneric>
                        <S.ListToDownloadItemInput className="radio">
                          <input name="download" type="radio" value={itag} />
                          <span></span>
                        </S.ListToDownloadItemInput>
                        <p>{currentType == "audio" ? audioBitrate : VideoQuality}</p>
                      </S.ListToDownloadGeneric>
                      <S.ListToDownloadItemText>{mimeType}</S.ListToDownloadItemText>
                      <S.ListToDownloadItemText>{totalSizeMB}</S.ListToDownloadItemText>
                    </S.ListToDownloadItem>
                  );
                })}

                {currentListOfFiles.length === 0 && <p>nenhum arquivo encontrado</p>}
              </S.ListToDownloadBody>
            </S.ListToDownloadContainer>
          </S.Container>
        </>
      )}
    </>
  );
};

export default OptionModal;
