import styled from "styled-components";

const Container = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.5rem;
`;

const Card = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  border-radius: 5px;
  margin: 10px 0;
`;

const Thumbnail = styled.div`
  margin-right: 10px;
  max-width: 200px;

  img {
    width: 100%;
    height: 100%;
  }
`;

const Infos = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleVideo = styled.h2`
  margin: 10px 0;
`;

const Category = styled.h3`
  margin: 10px 0;
`;

const PublishDate = styled.h3`
  margin: 10px 0;
`;

const LengthSeconds = styled.h3`
  margin: 10px 0;
`;

export {
  Container,
  Title,
  Card,
  Thumbnail,
  Infos,
  TitleVideo,
  Category,
  PublishDate,
  LengthSeconds
};
