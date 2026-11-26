import { useState } from 'react';
import { Alert, Container, Form, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Text from '../components/atoms/Text';
import Button from '../components/atoms/Button';
import Image from '../components/atoms/Image';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../services/orders';

const EMERALD_IMG = 'https://minecraft.wiki/images/Emerald_JE3_BE3.png';

function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ nombre: '', email: '' });
  const [status, setStatus] = useState('idle');
  const [order, setOrder] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomer((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');

    const payload = {
      customer,
      items: items.map((item) => ({
        productId: item.id,
        nombre: item.nombre,
        cantidad: item.quantity,
        precioUnitario: item.precio_esmeraldas,
      })),
      total: totalPrice,
    };

    try {
      const created = await createOrder(payload);
      setOrder({ ...payload, ...created });
      clearCart();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success' && order) {
    return (
      <Container className="my-5 mine-home text-center">
        <Text variant="h1">¡Compra realizada!</Text>
        <Text variant="p">
          Gracias {order.customer.nombre}, te enviamos el detalle a {order.customer.email}.
        </Text>
        <Text variant="p">N° de orden: {order.id}</Text>
        <Text variant="h4">
          Total: {order.total} <Image src={EMERALD_IMG} alt="Esmeralda" width="25" height="25" />
        </Text>
        <Button variant="primary" className="mt-3" onClick={() => navigate('/products')}>
          Seguir comprando
        </Button>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="my-5 mine-home text-center">
        <Text variant="h1">Tu carrito está vacío</Text>
        <Button variant="primary" className="mt-3" onClick={() => navigate('/products')}>
          Ver productos
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5 mine-home">
      <Text variant="h1">Finalizar compra</Text>

      <Table bordered responsive className="mt-3">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.quantity}</td>
              <td>
                {item.precio_esmeraldas * item.quantity}{' '}
                <Image src={EMERALD_IMG} alt="Esmeralda" width="20" height="20" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Text variant="h4" className="text-end">
        Total: {totalPrice} <Image src={EMERALD_IMG} alt="Esmeralda" width="25" height="25" />
      </Text>

      <Form onSubmit={handleSubmit} className="mt-4">
        <Form.Group className="mb-3" controlId="checkout-nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="nombre"
            value={customer.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="checkout-email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {status === 'error' && (
          <Alert variant="danger">
            No pudimos procesar la compra. Revisa el stock e inténtalo nuevamente.
          </Alert>
        )}

        <Button type="submit" variant="primary" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <>
              <Spinner size="sm" className="me-2" /> Procesando...
            </>
          ) : (
            'Confirmar compra'
          )}
        </Button>
      </Form>
    </Container>
  );
}

export default Checkout;
