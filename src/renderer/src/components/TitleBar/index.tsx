import React from "react";
import * as S from "./styles";

const TitleBar: React.FC = () => {
  const handleMinimize = (): void => {
    window.api.window.minimize();
  };

  const handleClose = (): void => {
    window.api.window.close();
  };

  return (
    <S.Container>
      <S.Title>v 1.0.0</S.Title>
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
