import { useEffect, useState } from 'react';
import { Alert, Card, Container, Row, Spinner, Table } from 'react-bootstrap';
import Text from '../components/atoms/Text';
import Button from '../components/atoms/Button';
import Image from '../components/atoms/Image';
import DynamicForm from '../components/molecules/DynamicForm';
import {
  createProduct,
  deleteProduct,
  getProductData,
  updateProduct,
} from '../services/products';
import { getApiErrorMessage } from '../utils/errors';

const initialForm = {
  nombre: '',
  id_categoria: '',
  descripcion: '',
  precio_esmeraldas: '',
  stock: '',
  id_imagen: '',
};

function Admin() {
  const [catalog, setCatalog] = useState({ products: [], categories: [], images: [] });
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      try {
        const data = await getProductData();
        if (isMounted) {
          setCatalog(data);
          setStatus('success');
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getApiErrorMessage(
            error,
            'No se pudo cargar el inventario. Inténtalo más tarde.'
          ));
          setStatus('error');
        }
      }
    }

    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setFeedback(null);
    setErrorMessage('');
  };

  const formInputs = [
    {
      id: 'nombre',
      label: 'Nombre del producto',
      type: 'text',
      placeholder: 'Ej: Espada de Diamante',
      minLength: 2,
      maxLength: 50,
      required: true,
      value: formData.nombre,
      onChange: (event) => handleChange('nombre', event.target.value),
    },
    {
      id: 'id_categoria',
      label: 'Categoría',
      type: 'select',
      required: true,
      value: formData.id_categoria,
      options: [
        { value: '', label: 'Selecciona una categoría' },
        ...catalog.categories.map((category) => ({
          value: String(category.id_categoria),
          label: category.nombreCategoria,
        })),
      ],
      onChange: (event) => handleChange('id_categoria', event.target.value),
    },
    {
      id: 'precio_esmeraldas',
      label: 'Precio (Esmeraldas)',
      type: 'number',
      min: 0,
      step: 'any',
      required: true,
      value: formData.precio_esmeraldas,
      onChange: (event) => handleChange('precio_esmeraldas', event.target.value),
    },
    {
      id: 'stock',
      label: 'Stock disponible',
      type: 'number',
      min: 0,
      step: 1,
      required: true,
      value: formData.stock,
      onChange: (event) => handleChange('stock', event.target.value),
    },
    {
      id: 'id_imagen',
      label: 'Imagen del producto',
      type: 'select',
      required: true,
      value: formData.id_imagen,
      options: [
        { value: '', label: 'Selecciona una imagen' },
        ...catalog.images.map((image) => ({
          value: String(image.id_imagen),
          label: `Imagen ${image.id_imagen}: ${image.urlImagen}`,
        })),
      ],
      onChange: (event) => handleChange('id_imagen', event.target.value),
    },
    {
      id: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      rows: 3,
      minLength: 5,
      maxLength: 200,
      required: true,
      placeholder: 'Descripción detallada...',
      value: formData.descripcion,
      onChange: (event) => handleChange('descripcion', event.target.value),
    },
  ];

  function handleEdit(product) {
    setEditingId(product.id);
    setFormData({
      nombre: product.nombre,
      id_categoria: String(product.id_categoria),
      descripcion: product.descripcion,
      precio_esmeraldas: String(product.precio_esmeraldas),
      stock: String(product.stock),
      id_imagen: String(product.id_imagen),
    });
    setFeedback(null);
    setErrorMessage('');
  }

  function handleCancel() {
    setEditingId(null);
    setFormData(initialForm);
    setFeedback(null);
  }

  async function reloadCatalog() {
    try {
      setCatalog(await getProductData());
    } catch (error) {
      setErrorMessage(
        `El cambio se guardó, pero no se pudo actualizar la lista. ${getApiErrorMessage(
          error,
          'Vuelve a cargar la página.'
        )}`
      );
    }
  }

  async function handleSubmit(event) {
    event.preventDefault?.();

    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      setFeedback({ variant: 'danger', message: 'Completa el nombre y la descripción.' });
      return;
    }
    if (!formData.id_categoria || !formData.id_imagen) {
      setFeedback({ variant: 'danger', message: 'Selecciona una categoría y una imagen.' });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setFeedback(null);

    try {
      if (editingId === null) {
        await createProduct(formData);
      } else {
        await updateProduct(editingId, formData);
      }
      await reloadCatalog();
      const successMessage = editingId === null
        ? 'Producto creado correctamente.'
        : 'Producto actualizado correctamente.';
      setEditingId(null);
      setFormData(initialForm);
      setFeedback({
        variant: 'success',
        message: successMessage,
      });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(
        error,
        'No se pudo guardar el producto. Revisa los datos e inténtalo nuevamente.'
      ));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setIsSubmitting(true);
    setErrorMessage('');
    setFeedback(null);

    try {
      await deleteProduct(id);
      await reloadCatalog();
      setFeedback({ variant: 'success', message: 'Producto eliminado correctamente.' });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(
        error,
        'No se pudo eliminar el producto. Inténtalo nuevamente.'
      ));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container className="my-5">
      <Text variant="h2" className="mb-4">Panel de Administración</Text>

      {errorMessage && <Alert variant="danger" role="alert">{errorMessage}</Alert>}
      {feedback && <Alert variant={feedback.variant} role="status">{feedback.message}</Alert>}

      <Row>
        <Card className="p-3 shadow-sm">
          <Card.Body>
            <Text variant="h4" className="mb-3">
              {editingId !== null ? 'Editar Producto' : 'Nuevo Producto'}
            </Text>

            {status === 'loading' ? (
              <div role="status">
                <Spinner animation="border" size="sm" className="me-2" />
                Cargando opciones…
              </div>
            ) : status === 'success' ? (
              <>
                <DynamicForm inputs={formInputs} onSubmit={handleSubmit}>
                  <div className="mt-3 d-flex gap-2">
                    <Button
                      type="submit"
                      variant={editingId !== null ? 'warning' : 'success'}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? 'Guardando…'
                        : editingId !== null
                          ? 'Guardar Cambios'
                          : 'Crear Producto'}
                    </Button>
                    {editingId !== null && (
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={isSubmitting}
                        onClick={handleCancel}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </DynamicForm>
              </>
            ) : (
              <Text variant="p">No se pudo cargar el formulario de productos.</Text>
            )}
          </Card.Body>
        </Card>

        <Card className="p-3 shadow-sm">
          <Card.Body>
            <Text variant="h4" className="mb-3">Lista de Inventario</Text>
            {status === 'loading' ? (
              <Spinner animation="border" size="sm" role="status" />
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.nombre}</td>
                      <td>
                        {product.precio_esmeraldas}{' '}
                        <Image
                          src="https://minecraft.wiki/images/Emerald_JE3_BE3.png"
                          alt="Esmeralda"
                          width="25"
                          height="25"
                        />
                      </td>
                      <td>{product.stock}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            type="button"
                            variant="outline-primary"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={() => handleEdit(product)}
                          >
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="outline-danger"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={() => handleDelete(product.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {catalog.products.length === 0 && (
                    <tr>
                      <td colSpan="5">No hay productos registrados.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
}

export default Admin;
