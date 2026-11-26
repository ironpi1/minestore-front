import { Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import Image from '../atoms/Image';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import QuantitySelector from '../molecules/QuantitySelector';

const EMERALD_IMG = 'https://minecraft.wiki/images/Emerald_JE3_BE3.png';

function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalItems,
    totalPrice,
  } = useCart();
  const navigate = useNavigate();

  const goTo = (path) => {
    closeCart();
    navigate(path);
  };

  return (
    <Offcanvas show={isOpen} onHide={closeCart} placement="end" className="mine-cart">
      <Offcanvas.Header closeButton closeVariant="white">
        <Offcanvas.Title>Carrito ({totalItems})</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column">
        {items.length === 0 ? (
          <div className="text-center my-auto">
            <Text variant="p">Tu carrito está vacío.</Text>
            <Button variant="primary" onClick={() => goTo('/products')}>
              Ver productos
            </Button>
          </div>
        ) : (
          <>
            <ul className="mine-cart__list">
              {items.map((item) => (
                <li key={item.id} className="mine-cart__item">
                  <Image src={item.imagen} alt={item.nombre} className="mine-cart__img" />
                  <div className="flex-grow-1">
                    <Text variant="p" className="mb-1">{item.nombre}</Text>
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <QuantitySelector
                        value={item.quantity}
                        max={item.stock}
                        onChange={(quantity) => updateQuantity(item.id, quantity)}
                      />
                      <span>
                        {item.precio_esmeraldas * item.quantity}{' '}
                        <Image src={EMERALD_IMG} alt="Esmeralda" width="18" height="18" />
                      </span>
                    </div>
                    <button
                      type="button"
                      className="mine-cart__remove"
                      onClick={() => removeItem(item.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mine-cart__footer mt-auto">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Text variant="h5" className="mb-0">Total</Text>
                <Text variant="h5" className="mb-0">
                  {totalPrice} <Image src={EMERALD_IMG} alt="Esmeralda" width="24" height="24" />
                </Text>
              </div>
              <Button variant="primary" className="w-100" onClick={() => goTo('/checkout')}>
                Finalizar compra
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default CartDrawer;
