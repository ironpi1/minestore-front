import { useEffect, useState } from 'react';
import { Alert, Container, Row, Spinner } from 'react-bootstrap';
import ProductCard from '../components/organisms/ProductCard';
import Text from '../components/atoms/Text';
import { getBestSellingProducts, ORDERS_UPDATED_EVENT } from '../services/orders';
import { getProducts } from '../services/products';
import { getApiErrorMessage } from '../utils/errors';

function getHomeSection(products) {
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
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const section = getHomeSection(products);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const availableProducts = await getProducts();
        if (isMounted) {
          setProducts(availableProducts);
          setStatus('success');
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getApiErrorMessage(
            error,
            'No se pudieron cargar los productos. Inténtalo más tarde.'
          ));
          setStatus('error');
        }
      }
    }

    const refreshBestSellers = () => setProducts((current) => [...current]);
    const handleStorage = (event) => {
      if (event.key === 'mine_orders') refreshBestSellers();
    };

    loadProducts();
    window.addEventListener(ORDERS_UPDATED_EVENT, refreshBestSellers);
    window.addEventListener('storage', handleStorage);

    return () => {
      isMounted = false;
      window.removeEventListener(ORDERS_UPDATED_EVENT, refreshBestSellers);
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
          {status === 'success' ? section.title : 'Productos'}
        </Text>
        {status === 'loading' && (
          <div className="text-center" role="status">
            <Spinner animation="border" />
            <span className="visually-hidden">Cargando productos…</span>
          </div>
        )}
        {status === 'error' && (
          <Alert variant="danger" role="alert">{errorMessage}</Alert>
        )}
        {status === 'success' && (
          <>
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
          </>
        )}
      </section>
    </Container>
  );
}

export default Home;
