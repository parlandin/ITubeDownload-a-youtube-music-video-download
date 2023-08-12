import Slider from "react-rangeslider";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  color: #fff;
  font-weight: 600;
  font-size: 1.3rem;
  margin: 15px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 30px;
  margin-left: 15px;
`;

const InputLabel = styled.label`
  color: #fff;
`;

const InputBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-top: 10px;
`;

const InputText = styled.div`
  width: 100%;
  background-color: #121212;
  border-radius: 5px 0 0 5px;
  padding: 10px;
  border: 1px solid #feffff1a;
  font-size: 1rem;
  color: #fff;
`;

const InputButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: max-content;
  cursor: pointer;
  height: 38px;
  border: none;
  margin-right: 15px;
  border-radius: 0 5px 5px 0;
  color: #ff2300;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #bdbdbd;
  }
`;

//slider component
const SliderStyle = styled(Slider)`
  margin-right: 15px;
  background: #464646;
  height: 9px;
  cursor: pointer;

  & .rangeslider__handle-label {
    display: none;
  }

  & .rangeslider__label-item {
    color: #fff;
    max-width: 50px;
    text-align: center;
    line-height: 18px;

    &:last-of-type {
      max-width: 30px;
    }
  }

  & .rangeslider__fill {
    background-color: #ff2300;
  }

  & .rangeslider__handle {
    background: #202020;
    border: 1px solid #1a1a1a;
    width: 20px;
    height: 20px;

    &::after {
      width: 10px;
      height: 10px;
      top: 4px;
      left: 4px;
      background-color: #585858;
    }
  }
`;

export {
  Container,
  Title,
  InputContainer,
  InputLabel,
  InputBox,
  InputText,
  InputButton,
  SliderStyle
};
