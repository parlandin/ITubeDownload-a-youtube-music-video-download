import Reset from "@renderer/styles/reset";
import Global from "@renderer/styles/GlobalStyle";

const GlobalStyles = (): JSX.Element => {
  return (
    <>
      <Reset />
      <Global />
    </>
  );
};

export default GlobalStyles;
