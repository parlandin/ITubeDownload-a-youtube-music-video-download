import { NavLink } from "react-router-dom";
import * as S from "./styles";

const Sidebar = (): JSX.Element => {
  return (
    <S.Container>
      <S.Nav>
        <S.NavItem>
          <NavLink to="/settings">Geral</NavLink>
        </S.NavItem>
        <S.NavItem>
          <a>Em Breve</a>
        </S.NavItem>
        <S.NavItem>
          <a>Em Breve</a>
        </S.NavItem>
        <S.NavItem>
          <a>Em Breve</a>
        </S.NavItem>
        <S.NavItem>
          <a>Em Breve</a>
        </S.NavItem>
      </S.Nav>
    </S.Container>
  );
};

export default Sidebar;
