import React from "react";
import styled from "styled-components";
const StyledSoftwareDownload = styled.i`
  & {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(0.9);
    width: 16px;
    height: 6px;
    border: 2px solid;
    border-top: 0;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    margin-top: 8px;
  }
  &::after {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 8px;
    height: 8px;
    border-left: 2px solid;
    border-bottom: 2px solid;
    transform: rotate(-45deg);
    left: 2px;
    bottom: 4px;
    transition: all 0.2s ease-in-out;
  }
  &::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    border-radius: 3px;
    width: 2px;
    height: 10px;
    background: currentColor;
    left: 5px;
    bottom: 5px;
  }
`;
const DownloadIcon = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    return (
      <>
        <StyledSoftwareDownload {...props} ref={ref} icon-role="software-download" />
      </>
    );
  }
);

DownloadIcon.displayName = "DownloadIcon";

export default DownloadIcon;
