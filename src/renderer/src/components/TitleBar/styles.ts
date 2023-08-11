import { styled } from "styled-components";

const Container = styled.div`
  max-width: 100%;
  display: flex;
  height: 40px;
  background-color: #121212;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  padding: 5px;
  border-radius: 10px;
`;

const Title = styled.h1`
  color: #e8f1f2;
  font-size: 0.7rem;
  margin-left: 5px;
`;

const ActionMenu = styled.div`
  display: flex;
  align-items: baseline;
  -webkit-app-region: no-drag;
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  color: #ff2300;
  font-size: 1.5rem;
  margin: 5px;

  &:hover {
    cursor: pointer;
    background-color: #242425;
  }
`;

export { Container, Title, ActionMenu, Button };
