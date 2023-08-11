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

export { Container, Title, InputContainer, InputLabel, InputBox, InputText, InputButton };
