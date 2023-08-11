import styled from "styled-components";

const Container = styled.div`
  width: 120px;
  min-width: 120px;
  height: calc(100vh - 93px);
  border-right: 1px solid #feffff1a;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavItem = styled.li`
  list-style: none;
  margin: 10px;

  & a {
    text-decoration: none;
    color: #feffff;
    width: 100%;
    cursor: pointer;

    &:hover {
      color: #ff2300;
    }

    &.active {
      border-bottom: 2px solid #ff2300;
    }
  }
`;

export { Container, Nav, NavItem };
