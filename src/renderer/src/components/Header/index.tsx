import * as S from "./styles";
import { NavLink } from "react-router-dom";

const Header = (): JSX.Element => {
  return (
    <S.Container>
      <S.Logo>
        ITube<span>Download</span>
      </S.Logo>
      <S.Nav>
        <NavLink to="/">Downloads</NavLink>
        <NavLink to="/settings">configurações</NavLink>
      </S.Nav>
    </S.Container>
  );
};

export default Header;
