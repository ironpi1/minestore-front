import { useEffect, useState } from 'react';
import { Alert, Card, Container, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Image from '../components/atoms/Image';
import Text from '../components/atoms/Text';
import Button from '../components/atoms/Button';
import { useCart } from '../hooks/useCart';
import { getProductById } from '../services/products';
import { getApiErrorMessage } from '../utils/errors';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const { addItem, items } = useCart();

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        const selectedProduct = await getProductById(id);
        if (isMounted) {
          setProduct(selectedProduct);
          setStatus('success');
        }
      } catch (error) {
        if (isMounted) {
          if (error?.response?.status === 404) {
            setStatus('not-found');
            return;
          }
          setErrorMessage(getApiErrorMessage(
            error,
            'No se pudo cargar el producto. Inténtalo más tarde.'
          ));
          setStatus('error');
        }
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (status === 'loading') {
    return (
      <Container className="my-5 text-center" role="status">
        <Spinner animation="border" />
        <span className="visually-hidden">Cargando producto…</span>
      </Container>
    );
  }

  if (status === 'error') {
    return (
      <Container className="my-5">
        <Alert variant="danger" role="alert">{errorMessage}</Alert>
      </Container>
    );
  }

  if (status === 'not-found') {
    return (
      <Container className="my-5">
        <Alert variant="info">Producto no encontrado.</Alert>
      </Container>
    );
  }

  const quantityInCart = items.find((item) => item.id === product.id)?.quantity ?? 0;

  return (
    <Container className="my-5">
      <Card className="minecraft-detail">
        <Image src={product.imagen} alt={product.nombre} className="card-img-top" />
        <Card.Body>
          <Text variant="h2">{product.nombre}</Text>
          <Text variant="p">{product.descripcion}</Text>
          <Text variant="h4">{product.precio_esmeraldas} esmeraldas</Text>
          <Text variant="p">Stock: {product.stock}</Text>
          <Button
            variant="primary"
            disabled={Number(product.stock) <= 0 || quantityInCart >= Number(product.stock)}
            onClick={() => addItem(product)}
          >
            {Number(product.stock) <= 0 ? 'Agotado' : 'Agregar al carrito'}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductDetail;
