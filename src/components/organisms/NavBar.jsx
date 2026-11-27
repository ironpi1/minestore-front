import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { isAdminRole } from '../../utils/roles';

function NavBar() {
  const { totalItems, openCart } = useCart();
  const { isAuthenticated, role, logout } = useAuth();

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
            {isAdminRole(role) && (
              <Nav.Link as={Link} to="/admin">Administración</Nav.Link>
            )}
            <Nav.Link href="/register">Registro</Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  Sesión iniciada{role ? ` · ${role}` : ''}
                </Navbar.Text>
                <Nav.Link as="button" type="button" className="btn btn-link" onClick={logout}>
                  Cerrar sesión
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Iniciar sesión</Nav.Link>
            )}
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