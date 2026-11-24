import { useState } from 'react';
import { Alert, Container, Form } from 'react-bootstrap';
import Button from '../components/atoms/Button';
import Text from '../components/atoms/Text';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [feedback, setFeedback] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setFeedback(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFeedback({ variant: 'danger', message: 'Las contraseñas no coinciden.' });
      return;
    }

    setFeedback({
      variant: 'info',
      message: 'El formulario es válido, pero el registro aún no está conectado a un servicio.',
    });
  }

  return (
    <Container className="my-5 mine-home">
      <Text variant="h1">Crear cuenta</Text>
      <Text variant="p">Completa tus datos para registrarte.</Text>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="register-name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="register-email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="register-password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Form.Text>Debe tener al menos 8 caracteres.</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="register-confirm-password">
          <Form.Label>Confirmar contraseña</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            minLength={8}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit">Crear cuenta</Button>
      </Form>

      {feedback && (
        <Alert className="mt-3 mb-0" variant={feedback.variant} role="status">
          {feedback.message}
        </Alert>
      )}
    </Container>
  );
}

export default Register;