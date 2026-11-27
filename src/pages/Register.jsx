import { useEffect, useState } from 'react';
import { Alert, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Button from '../components/atoms/Button';
import Text from '../components/atoms/Text';
import api from '../services/api';
import {
  COMUNAS_ENDPOINT,
  ROLES_ENDPOINT,
  USER_REGISTER_ENDPOINT,
} from '../services/endpoints';

function getRegisterError(error) {
  const responseData = error.response?.data;
  const serverMessage = typeof responseData === 'string'
    ? responseData
    : [
      responseData?.message,
      responseData?.mensaje,
      responseData?.error,
      responseData?.detail,
      responseData?.title,
    ].find((message) => typeof message === 'string' && message.trim());

  if (serverMessage) return serverMessage;
  if (error.response?.status === 400) {
    return 'Revisa los datos ingresados e inténtalo nuevamente.';
  }
  if (error.response) return 'No se pudo crear la cuenta. Inténtalo más tarde.';
  if (error.request) {
    return 'No se pudo conectar. Revisa tu conexión e inténtalo nuevamente.';
  }
  return 'No se pudo crear la cuenta. Inténtalo nuevamente.';
}

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    comuna: '',
  });
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [clientRole, setClientRole] = useState(null);
  const [comunas, setComunas] = useState([]);
  const [optionsError, setOptionsError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadRegistrationOptions() {
      try {
        const [rolesResponse, comunasResponse] = await Promise.all([
          api.get(ROLES_ENDPOINT),
          api.get(COMUNAS_ENDPOINT),
        ]);

        if (!Array.isArray(rolesResponse.data) || !Array.isArray(comunasResponse.data)) {
          throw new Error('La API devolvió opciones de registro con un formato inválido.');
        }

        const role = rolesResponse.data.find(
          (item) => item.nombreRol?.trim().toUpperCase() === 'CLIENTE'
        );
        const availableComunas = comunasResponse.data.filter(
          (item) => Number.isInteger(item.id_comuna) && item.nombreComuna
        );

        if (!isMounted) return;

        setClientRole(role ?? null);
        setComunas(availableComunas);

        if (!role) {
          setOptionsError('El registro no está disponible en este momento. Inténtalo más tarde.');
        } else if (availableComunas.length === 0) {
          setOptionsError('No hay comunas disponibles para completar el registro.');
        }
      } catch (error) {
        if (isMounted) {
          setOptionsError(getRegisterError(error));
        }
      } finally {
        if (isMounted) {
          setIsLoadingOptions(false);
        }
      }
    }

    loadRegistrationOptions();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setFeedback(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFeedback({ variant: 'danger', message: 'Las contraseñas no coinciden.' });
      return;
    }

    if (!clientRole || !formData.comuna) {
      setFeedback({
        variant: 'danger',
        message: !clientRole
          ? 'El registro no está disponible en este momento. Inténtalo más tarde.'
          : 'Selecciona una comuna para continuar.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await api.post(USER_REGISTER_ENDPOINT, {
        nombre_usuario: formData.name,
        correo_electronico: formData.email,
        contrasena: formData.password,
        rol: { id_rol: clientRole.id_rol },
        comuna: { id_comuna: Number(formData.comuna) },
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        comuna: '',
      });
      setFeedback({
        variant: 'success',
        message: 'Cuenta creada correctamente. Ya puedes iniciar sesión.',
      });
    } catch (error) {
      setFeedback({ variant: 'danger', message: getRegisterError(error) });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container className="my-5 mine-home">
      <Text variant="h1">Crear cuenta</Text>
      <Text variant="p">Completa tus datos para registrarte.</Text>

      {isLoadingOptions && (
        <Alert variant="info" role="status">
          Cargando opciones de registro…
        </Alert>
      )}
      {!isLoadingOptions && optionsError && (
        <Alert variant={clientRole ? 'warning' : 'danger'} role="status">
          {optionsError}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="register-name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            autoComplete="name"
            minLength={2}
            maxLength={50}
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
            maxLength={50}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="register-comuna">
          <Form.Label>Comuna</Form.Label>
          <Form.Select
            name="comuna"
            value={formData.comuna}
            onChange={handleChange}
            disabled={isLoadingOptions || comunas.length === 0}
            required
          >
            <option value="">Selecciona tu comuna</option>
            {comunas.map((comuna) => (
              <option key={comuna.id_comuna} value={comuna.id_comuna}>
                {comuna.nombreComuna}{comuna.nombreRegion ? `, ${comuna.nombreRegion}` : ''}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="register-password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={300}
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
            maxLength={300}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button
          type="submit"
          disabled={isSubmitting || isLoadingOptions || !clientRole || comunas.length === 0}
        >
          {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </Form>

      {feedback && (
        <Alert className="mt-3 mb-0" variant={feedback.variant} role="status">
          {feedback.message}
          {feedback.variant === 'success' && (
            <>
              {' '}
              <Link to="/login">Iniciar sesión</Link>
            </>
          )}
        </Alert>
      )}
    </Container>
  );
}

export default Register;