import React, { useMemo } from "react";
import { calculateBuyerPoints } from "../points/points";
import { totalPoints3months } from "../points/totalPoints";


function Checkout({ cart, onAdd, onRemoveOne, onRemoveItem, onClear, onPurchase, purchasing, customer, transactions }) {
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  }, [cart]);

  const cartPoints = calculateBuyerPoints(total);

    const { filtered, months, monthKeys, totalPoints } =
  totalPoints3months(transactions || [], customer?.id);


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

          <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
            <strong>New Points</strong>
            <strong>{cartPoints}</strong>
            </div>



          <button
            type="button"
            onClick={onClear}
            style={{ marginTop: 12, width: "100%" }}
          >
            Remove all items
          </button>

         <button type="button"
            onClick={onPurchase}
            disabled={cart.length === 0 || purchasing}
            style={{ marginTop: 10, width: "100%" }}
            >
            {purchasing ? "Processing..." : "purchase!"}
        </button>

        <hr style={{ margin: "16px 0" }} />

<h3 style={{ margin: "0 0 8px" }}>
  Points (last 3 months){customer?.name ? `: ${customer.name}` : ""}
</h3>

{filtered.length === 0 ? (
  <p style={{ margin: 0 }}>No transactions in the last 3 months.</p>
) : (
  <>
    <div style={{ marginBottom: 10 }}>
      <strong>Total points:</strong> {totalPoints}
    </div>

    <div style={{ marginBottom: 10 }}>
      <strong>Points per month:</strong>
      <ul style={{ margin: "6px 0 0 18px" }}>
        {monthKeys.map((m) => (
          <li key={m}>
            {m}: {months[m]} pts
          </li>
        ))}
      </ul>
    </div>

    <details>
      <summary>View transactions</summary>
      <ul style={{ margin: "8px 0 0 18px" }}>
        {filtered.map((t) => (
          <li key={t.id}>
            {new Date(t.createdAt).toLocaleDateString()} — $
            {t.total.toFixed(2)} — {t.points} pts
          </li>
        ))}
      </ul>
    </details>
  </>
)}

 
        </>
      )}
    </div>
  );
}

export default Checkout;
