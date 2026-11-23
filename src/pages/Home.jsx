import React from 'react';
import { Container } from 'react-bootstrap';
import Text from '../components/atoms/Text';

function Home() {
  return (
    <Container className="text-center my-5 mine-home">
      <Text variant="h1" className="text-white">Bienvenido a MineShop</Text>
      <Text variant="h4" className="text-white mt-3">Todo lo necesario para tu supervivencia.</Text>
    </Container>
  );
}

export default Home;