import api from './api';
import {
  CATEGORIES_ENDPOINT,
  IMAGES_ENDPOINT,
  PRODUCTS_ENDPOINT,
} from './endpoints';

function requireList(data, resourceName) {
  if (!Array.isArray(data)) {
    throw new Error(`La API devolvió una lista de ${resourceName} inválida.`);
  }
  return data;
}

function normalizeProduct(product, categoriesById, imagesById) {
  const id = Number(product.id_producto);
  const categoryId = Number(product.id_categoria ?? product.categoria?.id_categoria);
  const imageId = Number(product.id_imagen ?? product.imagen?.id_imagen);
  const category = categoriesById.get(categoryId);
  const image = imagesById.get(imageId);
  const price = Number(product.precioProducto);
  const stock = Number(product.stockProducto);

  if (
    !Number.isInteger(id)
    || !category?.nombreCategoria
    || !image?.urlImagen
    || typeof product.nombreProducto !== 'string'
    || typeof product.descripcionProducto !== 'string'
    || !Number.isFinite(price)
    || !Number.isInteger(stock)
  ) {
    throw new Error(`El producto ${product.nombreProducto || id} tiene datos relacionados inválidos.`);
  }

  return {
    id,
    nombre: product.nombreProducto,
    categoria: category.nombreCategoria,
    descripcion: product.descripcionProducto,
    precio_esmeraldas: price,
    stock,
    imagen: image.urlImagen,
    id_categoria: categoryId,
    id_imagen: imageId,
  };
}

export async function getProductData() {
  const [productsResponse, categoriesResponse, imagesResponse] = await Promise.all([
    api.get(PRODUCTS_ENDPOINT),
    api.get(CATEGORIES_ENDPOINT),
    api.get(IMAGES_ENDPOINT),
  ]);
  const rawProducts = requireList(productsResponse.data, 'productos');
  const categories = requireList(categoriesResponse.data, 'categorías');
  const images = requireList(imagesResponse.data, 'imágenes');
  const categoriesById = new Map(
    categories.map((category) => [Number(category.id_categoria), category])
  );
  const imagesById = new Map(
    images.map((image) => [Number(image.id_imagen), image])
  );

  return {
    products: rawProducts.map((product) => (
      normalizeProduct(product, categoriesById, imagesById)
    )),
    categories,
    images,
  };
}

export async function getProducts() {
  const { products } = await getProductData();
  return products;
}

export async function getProductById(id) {
  const [productResponse, categoriesResponse, imagesResponse] = await Promise.all([
    api.get(`${PRODUCTS_ENDPOINT}/${id}`),
    api.get(CATEGORIES_ENDPOINT),
    api.get(IMAGES_ENDPOINT),
  ]);
  const categories = requireList(categoriesResponse.data, 'categorías');
  const images = requireList(imagesResponse.data, 'imágenes');
  const categoriesById = new Map(
    categories.map((category) => [Number(category.id_categoria), category])
  );
  const imagesById = new Map(
    images.map((image) => [Number(image.id_imagen), image])
  );

  return normalizeProduct(productResponse.data, categoriesById, imagesById);
}

function toApiProduct(product, id) {
  const rawPrice = String(product.precio_esmeraldas ?? '').trim();
  const rawStock = String(product.stock ?? '').trim();
  const categoryId = Number(product.id_categoria);
  const imageId = Number(product.id_imagen);
  const price = Number(rawPrice);
  const stock = Number(rawStock);

  if (!rawPrice || !rawStock) {
    throw new Error('Ingresa el precio y el stock del producto.');
  }
  if (!Number.isInteger(categoryId) || !Number.isInteger(imageId)) {
    throw new Error('Selecciona una categoría y una imagen válidas.');
  }
  if (!product.nombre?.trim() || !product.descripcion?.trim()) {
    throw new Error('Ingresa el nombre y la descripción del producto.');
  }
  if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    throw new Error('El precio y el stock deben ser valores válidos.');
  }

  return {
    ...(id === undefined ? {} : { id_producto: Number(id) }),
    nombreProducto: product.nombre.trim(),
    descripcionProducto: product.descripcion.trim(),
    precioProducto: price,
    stockProducto: stock,
    categoria: { id_categoria: categoryId },
    imagen: { id_imagen: imageId },
  };
}

export async function createProduct(product) {
  const { data } = await api.post(PRODUCTS_ENDPOINT, toApiProduct(product));
  return data;
}

export async function updateProduct(id, product) {
  const { data } = await api.put(
    `${PRODUCTS_ENDPOINT}/${id}`,
    toApiProduct(product, id)
  );
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`${PRODUCTS_ENDPOINT}/${id}`);
  return data;
}
