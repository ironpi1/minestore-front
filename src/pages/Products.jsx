import { useEffect, useState } from 'react';
import { Alert, Container, Row, Spinner } from 'react-bootstrap';
import ProductCard from '../components/organisms/ProductCard';
import Text from '../components/atoms/Text';
import { getProducts } from '../services/products';
import { getApiErrorMessage } from '../utils/errors';

function Products() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

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

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Container className="my-4">
      <Text variant="h1" className="mb-4 text-center">Catálogo de Productos</Text>
      {status === 'loading' && (
        <div className="text-center" role="status">
          <Spinner animation="border" />
          <span className="visually-hidden">Cargando productos…</span>
        </div>
      )}
      {status === 'error' && <Alert variant="danger" role="alert">{errorMessage}</Alert>}
      {status === 'success' && products.length === 0 && (
        <Alert variant="info">No hay productos disponibles.</Alert>
      )}
      {status === 'success' && products.length > 0 && (
        <Row>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Products;
