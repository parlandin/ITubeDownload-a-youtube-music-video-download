import styled from "styled-components";

interface IFillerStyles {
  readonly completed: number;
  readonly bgcolor: string;
}

const ContainerStyles = styled.div`
  height: 5px;
  width: 100%;
  background-color: #e0e0de;
  border-radius: 50px;
`;

const FillerStyles = styled.div<IFillerStyles>`
  height: 100%;
  //@ts-ignore
  width: ${({ completed }): number => (completed ? completed : 0)}%;
  background-color: ${({ bgcolor }): string => bgcolor || "#1DA598"};
  border-radius: inherit;
  text-align: center;
`;

interface ProgressBarProps {
  bgcolor: string;
  completed: number;
}

const ProgressBar = ({ bgcolor, completed }: ProgressBarProps): JSX.Element => {
  return (
    <ContainerStyles>
      <FillerStyles completed={completed} bgcolor={bgcolor}></FillerStyles>
    </ContainerStyles>
  );
};

export default ProgressBar;
