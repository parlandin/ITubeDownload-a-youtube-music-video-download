import { styled } from "styled-components";

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainerStyle = styled.div`
  background-color: #0f0f0f;
  width: 100vw;
  height: 100vh;
  border-radius: 10px;
`;

const MainContainer = ({ children }: MainContainerProps): JSX.Element => {
  return <MainContainerStyle>{children}</MainContainerStyle>;
};

export default MainContainer;
