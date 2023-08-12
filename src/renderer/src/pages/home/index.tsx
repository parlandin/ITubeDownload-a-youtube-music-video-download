import DownloadComponent from "@components/Download";
import Header from "@components/Header";
import * as S from "./styles";
import { useState } from "react";
import OptionModal from "@components/OptionModal";
import SpinnerIcon from "@components/SpinnerIcon";
import DownloadsContainer from "@components/DownloadsContainer";

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

export interface VideoInfo {
  title: string;
  duration: string;
  thumbnail: string;
  listOfVideoInfos: IFormatInfo[];
  listOfAudioInfos: IFormatInfo[];
  formats: unknown;
}

const Home: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [erro, setErro] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo>();

  const handleDownload = async (): Promise<void> => {
    setErro("");
    const isValidUrl = await window.api.youtube.validateUrl(url);

    if (!isValidUrl) {
      setErro("O link informado não é válido");
      return;
    }

    setIsPending(true);
    getListOfVideosInfos(url);
  };

  const getListOfVideosInfos = async (url: string): Promise<void> => {
    const listOfVideos = (await window.api.youtube.getListOfVideosInfos(url)) as VideoInfo;

    setVideoInfo(listOfVideos);
    setIsOpenModal(true);
    setIsPending(false);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUrl(e.target.value);
  };

  const closeModal = (): void => {
    setIsOpenModal(false);
    setUrl("");
  };

  return (
    <S.Container>
      <OptionModal visible={isOpenModal} close={closeModal} data={videoInfo} />
      <Header />
      {/* <DownloadComponent /> */}

      {/*todo: This should be changed to a component */}
      <S.Description>
        Baixe vídeos e músicas do <span>Youtube</span> e <span>Youtube Music</span> de forma simples
        e rápida.
      </S.Description>

      <S.InputBox>
        <S.Input
          placeholder="Exemplo: https://www.youtube.com/watch?v=U7L-3VXAkSA"
          value={url}
          onChange={handleOnChange}
        />
        <S.Button onClick={handleDownload}>Buscar</S.Button>

        {erro && <S.Error>Error: {erro}</S.Error>}
        {isPending && (
          <S.PendingMessage>
            Coletando informações do vídeo <SpinnerIcon />
          </S.PendingMessage>
        )}
      </S.InputBox>

      {/* todo: fim  */}
      <DownloadsContainer />
    </S.Container>
  );
};

export default Home;
