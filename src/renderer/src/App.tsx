//import Versions from "./components/Versions";
import Router from "./routers";
import TitleBar from "@components/TitleBar";
import GlobalStyles from "@renderer/styles/index";
import MainContainer from "@components/MainContainer";
import DownloadProvider from "@renderer/context/downloadContext";

function App(): JSX.Element {
  return (
    <>
      <GlobalStyles />
      <MainContainer>
        <TitleBar />

        <DownloadProvider>
          <Router />
        </DownloadProvider>
      </MainContainer>
    </>
  );
}

export default App;
