import styled from "styled-components";

const BackgroundOverlay = styled.div`
  position: absolute;
  inset: 0;
  top: 40px;
  background-color: #000000;
  opacity: 0.6;
  width: 100%;
  height: calc(100% - 40px);
`;

const Container = styled.div`
  display: flex;
  position: absolute;
  background-color: #121212;
  width: 85%;
  height: 84%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 6px;
  z-index: 5;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  width: 90%;
  margin: 10px auto;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  cursor: pointer;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 1rem;

  &:hover {
    color: #ff0000;
  }
`;

const Title = styled.h1`
  /*  width: 90% */
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  /* margin: 10px auto; */
`;

const VideoContainer = styled.div`
  width: 90%;
  margin: 0px auto 10px;
  border-top: 1px solid #feffff1a;
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

const VideoTitle = styled.h1`
  font-size: 0.9rem;
  margin: 10px;
  color: #fff;
`;
const VideoDuration = styled.p`
  font-size: 0.9rem;
  margin: 10px;
  color: #fff;
`;

const TypeSelectorContainer = styled.div`
  width: 90%;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
`;

const TypeSelector = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 48%;
`;

const TypeSelectorLabel = styled.label`
  margin-bottom: 5px;
  color: #fff;
`;

const ChooseType = styled.select`
  width: 50%;
  height: 40px;
  border: none;
  border-radius: 6px;
  color: #fff;
  background-color: #2a2a2a;
  width: 100%;
  cursor: pointer;
  padding: 5px;
  font-size: 0.85rem;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
  }

  & option {
    margin: 5px 0;
    border: none;
  }
`;

const ListToDownloadContainer = styled.div`
  width: 90%;
  margin: 10px auto;
`;

const ListToDownloadHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ListToDownloadTitle = styled.p`
  color: #fff;
  font-size: 1rem;
  text-align: center;
  max-width: 33%;
  width: 33%;
  font-weight: 600;

  &:first-of-type {
    text-align: left;
  }

  &:last-of-type {
    text-align: right;
  }
`;

const ListToDownloadBody = styled.div`
  width: 100%;
  margin: 15px auto 0;
  height: 235px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ListToDownloadItem = styled.div`
  width: 100%;
  border-bottom: 1px solid #feffff1a;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
`;

const ListToDownloadItemText = styled.p`
  width: 33%;
  max-width: 33%;
  text-align: center;
  color: #fff;
  color: #c5c5c5;

  &.codec {
    word-break: break-all;
  }

  &:last-of-type {
    text-align: right;
    margin-right: 5px;
  }
`;

const ListToDownloadGeneric = styled.div`
  display: flex;
  align-items: center;
  width: 33%;
  max-width: 33%;

  & p {
    color: #fff;
    color: #c5c5c5;
  }
`;

const ListToDownloadItemInput = styled.label`
  display: block;
  cursor: pointer;
  user-select: none;
  text-align: left;

  input {
    display: none;
    & + span {
      /* display: inline-block; */
      position: relative;
      padding-left: 30px;
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 0px;
        left: 0px;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        //border: 1px solid #fff;
        border: 1px solid #d52f2f;
        background: #484848;
      }
      &:after {
        content: "";
        display: block;
        width: 14px;
        height: 14px;
        background: #f00;
        position: absolute;
        border-radius: 50%;
        top: 2px;
        left: 2px;
        opacity: 0;
        transform: scale(0, 0);
        transition: all 0.2s cubic-bezier(0.64, 0.57, 0.67, 1.53);
      }
    }
    &:checked + span:after {
      opacity: 1;
      transform: scale(1, 1);
    }
  }
`;

const DownloadContainer = styled.div`
  width: 90%;
  margin: 13px auto;
  display: flex;
  justify-content: flex-end;
`;

const DownloadButton = styled.button`
  border: 1px solid #feffff1a;
  border-left: none;
  border-radius: 6px;
  cursor: pointer;
  color: #ff0000;
  font-weight: 600;
  font-size: 1rem;
  background-color: #fff;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;

  & i {
    margin-left: 5px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const PendingMessage = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #d1d1d1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  & i {
    margin-left: 5px;
    color: #ff0000;
  }
`;

export {
  Container,
  BackgroundOverlay,
  CloseButton,
  Title,
  VideoContainer,
  VideoThumbnail,
  VideoDetails,
  VideoTitle,
  VideoDuration,
  Header,
  TypeSelectorContainer,
  TypeSelector,
  TypeSelectorLabel,
  ChooseType,
  ListToDownloadContainer,
  ListToDownloadHeader,
  ListToDownloadTitle,
  ListToDownloadBody,
  ListToDownloadItem,
  ListToDownloadItemInput,
  ListToDownloadGeneric,
  ListToDownloadItemText,
  DownloadContainer,
  DownloadButton,
  PendingMessage
};
