import { Navbar, Nav, Container } from 'react-bootstrap';
import { useCart } from '../../hooks/useCart';

function NavBar() {
  const { totalItems, openCart } = useCart();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">MineShop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Inicio</Nav.Link>
            <Nav.Link href="/products">Productos</Nav.Link>
            <Nav.Link href="/contact">Contacto</Nav.Link>
            <Nav.Link href="/admin">Administración</Nav.Link>
            <Nav.Link href="/register">Registro</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link
              as="button"
              type="button"
              className="btn btn-link"
              onClick={openCart}
              aria-label={`Abrir carrito, ${totalItems} productos`}
            >
              🛒 Carrito<span className="cart-badge">{totalItems}</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;