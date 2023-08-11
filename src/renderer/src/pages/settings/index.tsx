import Header from "@components/Header";
import Sidebar from "./components/Sidebar";
import * as S from "./styles";
import { Outlet } from "react-router-dom";

const Settings: React.FC = () => {
  return (
    <>
      <Header />
      <S.Container>
        <Sidebar />
        <Outlet />
      </S.Container>
    </>
  );
};

export default Settings;
