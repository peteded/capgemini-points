import React, { useMemo } from "react";

function Checkout({ cart, onAdd, onRemoveOne, onRemoveItem, onClear }) {
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  }, [cart]);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        height: "fit-content",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Checkout</h2>

      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {cart.map((item) => (
              <li
                key={item.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                  gap: 8,
                }}
              >
                <div>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    ${item.price.toFixed(2)} each
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => onRemoveOne(item.name)}
                    aria-label={`Remove one ${item.name}`}
                  >
                    −
                  </button>

                  <span style={{ minWidth: 24, textAlign: "center" }}>
                    {item.qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => onAdd(item.name)}
                    aria-label={`Add one ${item.name}`}
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.name)}
                    aria-label={`Remove ${item.name} from cart`}
                    style={{ marginLeft: 6 }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <strong>Total</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <button
            type="button"
            onClick={onClear}
            style={{ marginTop: 12, width: "100%" }}
          >
            Remove all items
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
