import { useState } from 'react';
import { Alert, Container, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import Text from '../components/atoms/Text';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { AUTH_LOGIN_ENDPOINT } from '../services/endpoints';
import { getApiErrorMessage } from '../utils/errors';
import { isAdminRole } from '../utils/roles';

function getRole(data) {
  const role = data.rol ?? data.role;
  if (typeof role === 'string') return role;
  if (typeof role?.nombre === 'string') return role.nombre;
  if (typeof role?.name === 'string') return role.name;
  return null;
}

function Login() {
  const [credentials, setCredentials] = useState({
    correo_electronico: '',
    contrasena: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
    setErrorMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const { data } = await api.post(AUTH_LOGIN_ENDPOINT, credentials);
      const token = data?.token ?? data?.accessToken ?? data?.access_token ?? data?.jwt;

      if (typeof token !== 'string' || !token) {
        throw new Error('El servidor no devolvió un token de acceso.');
      }

      const role = getRole(data);
      login({ token, role });
      const destination = isAdminRole(role)
        ? location.state?.from?.pathname || '/'
        : '/';
      navigate(destination);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(
        error,
        'No se pudo iniciar sesión. Revisa tus datos e inténtalo nuevamente.'
      ));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container className="my-5 mine-home" style={{ maxWidth: '520px' }}>
      <Text variant="h1">Iniciar sesión</Text>
      <Text variant="p">Ingresa con tu correo electrónico y contraseña.</Text>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="login-email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="correo_electronico"
            autoComplete="email"
            value={credentials.correo_electronico}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="login-password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="contrasena"
            autoComplete="current-password"
            value={credentials.contrasena}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {errorMessage && (
          <Alert variant="danger" role="alert">
            {errorMessage}
          </Alert>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>
      </Form>
    </Container>
  );
}

export default Login;