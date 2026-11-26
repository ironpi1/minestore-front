import { Card } from 'react-bootstrap';
import Image from '../atoms/Image';
import Button from '../atoms/Button';
import CardBody from '../molecules/CardBody';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const inCart = items.find((item) => item.id === product.id)?.quantity ?? 0;
  const soldOut = Number(product.stock) <= 0;

  return (
    <Card className="m-2 minecraft-product-card">
      <Image src={product.imagen} alt={product.nombre} className="card-img-top" />
      <Card.Body>
        <CardBody
          title={product.nombre}
          categoria={product.categoria}
          description={product.descripcion}
          price={product.precio_esmeraldas}
        />
        <br />
        <Button variant="primary" onClick={() => navigate(`/products/${product.id}`)}>
          Ver detalles
        </Button>
        <Button
          variant="primary"
          className="mt-2"
          disabled={soldOut || inCart >= Number(product.stock)}
          onClick={() => addItem(product)}
        >
          {soldOut ? 'Agotado' : 'Agregar al carrito'}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;