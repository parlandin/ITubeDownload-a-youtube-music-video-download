//import Versions from "./components/Versions";
import Router from "./routers";
import TitleBar from "@components/TitleBar";
import GlobalStyles from "@renderer/styles/index";
import MainContainer from "@components/MainContainer";

function App(): JSX.Element {
  return (
    <>
      <GlobalStyles />
      <MainContainer>
        <TitleBar />
        <Router />
      </MainContainer>
    </>
  );
}

export default App;
