import { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import ProductCard from '../components/organisms/ProductCard';
import Text from '../components/atoms/Text';
import { getItems } from '../data/Products';
import { getBestSellingProducts, ORDERS_UPDATED_EVENT } from '../services/orders';

function getHomeSection() {
  const products = getItems();
  const bestSellers = getBestSellingProducts(products);

  if (bestSellers.length > 0) {
    return {
      title: 'Más vendidos',
      description: 'Los productos más elegidos por nuestros clientes.',
      products: bestSellers,
    };
  }

  return {
    title: 'Recomendados',
    description: 'Descubre algunos de los productos disponibles en la tienda.',
    products: products.filter((product) => Number(product.stock) > 0).slice(0, 3),
  };
}

function Home() {
  const [section, setSection] = useState(getHomeSection);

  useEffect(() => {
    const refreshSection = () => setSection(getHomeSection());
    const handleStorage = (event) => {
      if (event.key === 'mine_orders' || event.key === 'mine_products') {
        refreshSection();
      }
    };

    window.addEventListener(ORDERS_UPDATED_EVENT, refreshSection);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(ORDERS_UPDATED_EVENT, refreshSection);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <Container className="my-5 mine-home">
      <header className="text-center">
        <Text variant="h1" className="text-white">Bienvenido a MineShop</Text>
        <Text variant="h4" className="text-white mt-3">
          Todo lo necesario para tu supervivencia.
        </Text>
      </header>

      <section className="mt-5" aria-label={section.title}>
        <Text variant="h2" className="text-center">
          {section.title}
        </Text>
        <Text variant="p" className="text-center">
          {section.description}
        </Text>
        {section.products.length > 0 ? (
          <Row className="justify-content-center">
            {section.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Row>
        ) : (
          <Text variant="p" className="text-center">
            Pronto habrá nuevos productos disponibles.
          </Text>
        )}
      </section>
    </Container>
  );
}

export default Home;