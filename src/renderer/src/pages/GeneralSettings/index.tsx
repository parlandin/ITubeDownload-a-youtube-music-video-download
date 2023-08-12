import React, { useEffect, useState } from "react";
import * as S from "./styles";

import "react-rangeslider/lib/index.css";

const GeneralSettings: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [limiteSlider, setLimiteSlider] = useState<number>(1);

  const getSelectedFolder = async (): Promise<void> => {
    const selectedFolder = await window.api.settings.getSelectedFolder();
    setSelectedFolder(selectedFolder);
  };

  const handleFolderSelect = async (): Promise<void> => {
    const selectedFolder = await window.api.settings.selectFolder();
    setSelectedFolder(selectedFolder);
  };

  const getMaxDownloadsConcurrency = async (): Promise<void> => {
    const maxDownloadsConcurrency = await window.api.settings.getMaxDownloadsConcurrency();
    console.log(maxDownloadsConcurrency);
    setLimiteSlider(maxDownloadsConcurrency);
  };

  const setMaxDownloadsConcurrency = (value: number): void => {
    window.api.settings.setMaxDownloadsConcurrency(value);
  };

  const onChangeComplete = (): void => {
    setMaxDownloadsConcurrency(limiteSlider);
  };

  const horizontalLabels = {
    1: "1 Low",
    2: "2",
    3: "3",
    4: "4 Medium",
    5: "5",
    6: "6",
    7: "7 High"
  };

  const handleChangeLimiteSlider = (value: number): void => {
    setLimiteSlider(value);
  };

  useEffect(() => {
    if (window) {
      getSelectedFolder();
      getMaxDownloadsConcurrency();
    }
  }, []);

  return (
    <S.Container>
      <S.Title>Geral</S.Title>
      <S.InputContainer>
        <S.InputLabel>Pasta de download:</S.InputLabel>
        <S.InputBox>
          <S.InputText>{selectedFolder}</S.InputText>
          <S.InputButton onClick={handleFolderSelect}>Alterar pasta</S.InputButton>
        </S.InputBox>
      </S.InputContainer>

      <S.InputContainer>
        <S.InputLabel>Limite de downloads simultâneos:</S.InputLabel>

        <S.SliderStyle
          min={1}
          max={7}
          value={limiteSlider}
          labels={horizontalLabels}
          tooltip={true}
          onChange={handleChangeLimiteSlider}
          onChangeComplete={onChangeComplete}
        />
      </S.InputContainer>
    </S.Container>
  );
};

export default GeneralSettings;
