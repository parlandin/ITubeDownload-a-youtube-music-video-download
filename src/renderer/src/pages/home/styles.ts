import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const Description = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  text-align: center;
  margin: 0 auto;
  margin-top: 100px;
  max-width: 499px;
  line-height: 22px;

  & span {
    color: #fb3030f2;
    font-size: inherit;
    font-weight: inherit;
  }
`;

const InputBox = styled.div`
  width: 100%;
  margin: 25px auto 35px;
  display: flex;
  justify-content: center;
  position: relative;
`;

const Input = styled.input`
  height: 20px;
  width: 100%;
  padding: 10px;
  border-radius: 6px 0 0 6px;
  border: 1px solid #feffff1a;
  background-color: #121212;
  color: #fff;
  font-size: 0.9rem;
  max-width: 500px;
  border-right: none;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #9f9f9fde;
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  border: 1px solid #feffff1a;
  border-left: none;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  color: #ff0000;
  font-weight: 600;
  font-size: 1rem;

  &:hover {
    background-color: #ff0000;
    color: #fff;
  }
`;

const Error = styled.p`
  display: block;
  //margin: 0 auto;
  text-align: center;
  color: #ff0000;
  position: absolute;
  top: 51px;
`;

const PendingMessage = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #d1d1d1;
  position: absolute;
  top: 50px;

  & i {
    margin-left: 5px;
    color: #ff0000;
  }
`;

export { Container, Description, Input, InputBox, Button, Error, PendingMessage };
