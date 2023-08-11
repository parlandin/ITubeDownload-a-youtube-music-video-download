import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 10px;
  justify-content: space-between;
  border-top: 1px solid #feffff1a;
  border-bottom: 1px solid #feffff1a;
`;

const Logo = styled.div`
  color: #fff;
  font-weight: 600;
  font-size: 1.3rem;

  & span {
    color: #ff2300;
    background-color: #fff;
    font-weight: 600;
    padding: 5px;
    border-radius: 4px;
  }
`;

const Nav = styled.nav`
  display: block;
  & a {
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    margin: 5px;
    padding: 5px;

    &:hover {
      color: #ff2300;
    }

    &.active {
      //color: #ff2300;
      //border-bottom: 2px solid #ff2300;
      /*  border: 1px solid #feffff1a;
      background-color: #121212; */
      border: 1px solid #5e5e5ed4;
      background-color: #20202082;
      border-radius: 4px;
    }
  }
`;

export { Container, Logo, Nav };
