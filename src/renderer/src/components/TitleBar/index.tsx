import React, { useEffect, useState } from "react";
import * as S from "./styles";

const TitleBar: React.FC = () => {
  const [appVersion, setAppVersion] = useState<string>("");

  const handleGetAppVersion = async (): Promise<void> => {
    const version = await window.api.settings.getAppVersion();
    setAppVersion(version);
  };

  const handleMinimize = (): void => {
    window.api.window.minimize();
  };

  const handleClose = (): void => {
    window.api.window.close();
  };

  useEffect(() => {
    handleGetAppVersion();
  }, []);

  return (
    <S.Container>
      <S.Title>v {appVersion}</S.Title>
      <S.ActionMenu>
        <S.Button title="minimize" onClick={handleMinimize}>
          &minus;
        </S.Button>
        <S.Button title="close" onClick={handleClose}>
          &#10006;
        </S.Button>
      </S.ActionMenu>
    </S.Container>
  );
};

export default TitleBar;
