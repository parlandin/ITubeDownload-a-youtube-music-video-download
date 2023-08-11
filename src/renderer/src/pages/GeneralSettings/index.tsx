import React, { useEffect, useState } from "react";
import * as S from "./styles";

const GeneralSettings: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>("");

  const getSelectedFolder = async (): Promise<void> => {
    const selectedFolder = await window.api.youtube.getSelectedFolder();
    setSelectedFolder(selectedFolder);
  };

  const handleFolderSelect = async (): Promise<void> => {
    const selectedFolder = await window.api.youtube.selectFolder();
    setSelectedFolder(selectedFolder);
  };

  useEffect(() => {
    if (window) {
      getSelectedFolder();
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
    </S.Container>
  );
};

export default GeneralSettings;
