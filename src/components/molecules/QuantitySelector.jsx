function QuantitySelector({ value, max, onChange, size = 'md' }) {
  return (
    <div className={`qty qty-${size}`} role="group" aria-label="Cantidad">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Quitar uno"
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Agregar uno"
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
