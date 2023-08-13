import styled from "styled-components";

const Container = styled.div<{ isContent: boolean }>`
  display: flex;
  width: 90%;
  background-color: #121212;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0 auto;
  max-height: 314px;
  height: ${({ isContent }): string => (isContent ? "314px" : "0")};
  border-radius: 6px;
  padding: ${({ isContent }): string => (isContent ? "10px" : "0")};
  flex-direction: column;
`;

const VideoContainer = styled.div`
  width: 90%;
  margin: 0px auto 10px;
  //border-top: 1px solid #feffff1a;
  border-bottom: 1px solid #feffff1a;
  height: 90px;
  padding: 5px 0;
  display: flex;
`;

const VideoThumbnail = styled.div`
  border-radius: 6px;
  width: 80px;
  height: 80px;
  min-width: 100px;
  margin-right: 5px;

  & img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
`;

const VideoDetails = styled.div`
  width: 100%;
  height: 100px;
`;

const VideoText = styled.h1`
  font-size: 0.9rem;
  margin: 10px;
  color: #fff;

  &.title {
    display: block;
    font-size: 1rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    max-width: 600px;
  }

  &.text {
    font-size: 0.8rem;
    margin: 7px;
    color: #e9e9e9;
    margin-left: 10px;
  }

  &.download {
    display: flex;
    align-items: center;

    & span {
      color: inherit;
      font-size: inherit;
      font-weight: inherit;
      margin-right: 5px;
    }

    & > div {
      background-color: #464646;
      margin-top: 2.3px;
    }
  }
`;

const FilePath = styled.div`
  width: 100%;
  height: 23px;
  background-color: #2d2a27;
  color: #d0cfd3;
  border-radius: 6px;
  margin-left: 10px;
  padding: 7px;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 0.8rem;

  &:hover {
    cursor: pointer;
  }
`;

const FlipContainer = styled.div`
  width: 100%;
  perspective: 1000px;

  & div.flipper {
    transition: transform 0.8s;
    transform-style: preserve-3d;
    position: relative;

    ${VideoContainer}:hover & {
      transform: rotateX(180deg);
    }
  }

  & div.card {
    backface-visibility: hidden;
    position: absolute;
    width: 100%;

    &.back {
      transform: rotateX(180deg);
      bottom: 1px;
    }
  }
`;

export {
  Container,
  VideoContainer,
  VideoThumbnail,
  VideoDetails,
  VideoText,
  FilePath,
  FlipContainer
};
