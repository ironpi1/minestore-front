import { Container, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getItemById } from '../data/Products.js';
import Image from '../components/atoms/Image.jsx';
import Text from '../components/atoms/Text.jsx';
import Button from '../components/atoms/Button.jsx';
import { useCart } from '../hooks/useCart';


function ProductDetail() {
 const { id } = useParams();
 const product = getItemById(id);
 const { addItem, items } = useCart();


 if (!product) {
   return (
     <Container className="my-5">
       <h1>Producto no encontrado</h1>
     </Container>
   );
 }


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
             disabled={
               Number(product.stock) <= 0 ||
               (items.find((item) => item.id === product.id)?.quantity ?? 0) >= Number(product.stock)
             }
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
