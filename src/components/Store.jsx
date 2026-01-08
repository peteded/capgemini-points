import React, { useEffect, useState } from "react";
import { fetchAllPrices } from "../api/storeApi";
import Checkout from "./Checkout";
import { useNavigate } from "react-router-dom";


function Store() {
  const items = ["shirt", "pants", "shoes", "socks", "hat"];

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cart, setCart] = useState([]);

  const navigate = useNavigate();
const [purchasing, setPurchasing] = useState(false);

// simulating submitting an order to BE
function submitOrder(order) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true }), 800);
  });
}


  useEffect(() => {
    let isMounted = true;

    async function loadPrices() {
      try {
        const data = await fetchAllPrices();
        if (!isMounted) return;
        setPrices(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Oops I done goofed.");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    loadPrices();
    return () => {
      isMounted = false;
    };
  }, []);

  function addToCart(itemName) {
    const itemPrice = prices[itemName] ?? 0;

    setCart((prev) => {
      const existing = prev.find((x) => x.name === itemName);
      if (existing) {
        return prev.map((x) =>
          x.name === itemName ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prev, { name: itemName, qty: 1, price: itemPrice }];
    });
  }

  // remove sec

  function removeOne(itemName) {
    setCart((prev) =>
      prev
        .map((x) => (x.name === itemName ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );
  }

  function removeItem(itemName) {
    setCart((prev) => prev.filter((x) => x.name !== itemName));
  }

  function clearCart() {
    setCart([]);
  }

  function handleItemClick(item, index) {
    setSelectedIndex(index);
    addToCart(item);
  }

  async function handlePurchase() {
  if (cart.length === 0) return;

  setPurchasing(true);

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  const order = {
    id: Math.floor(Math.random() * 900000) + 100000, // fake order id
    items: cart,
    total,
    createdAt: new Date().toISOString(),
  };

  try {
    await submitOrder(order);
    clearCart();
    navigate("/confirmation", { state: { order } });
  } finally {
    setPurchasing(false);
  }
}


  return (
    <>
      <h1 className="text-3xl my-5">Peter&apos;s Store</h1>

      {loading && <p>Loading prices...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 16,
          }}
        >
          <div className="list-group">
            {items.map((item, index) => (
              <button
                key={item}
                type="button"
                className={
                  selectedIndex === index
                    ? "list-group-item list-group-item-action active"
                    : "list-group-item list-group-item-action"
                }
                onClick={() => handleItemClick(item, index)}
              >
                {item}
                {prices[item] != null && (
                  <span style={{ float: "right" }}>
                    ${prices[item].toFixed(2)}
                  </span>
                )}
              </button>
            ))}
          </div>

          <Checkout
            cart={cart}
            onAdd={addToCart}
            onRemoveOne={removeOne}
            onRemoveItem={removeItem}
            onClear={clearCart}
            onPurchase={handlePurchase}
            purchasing={purchasing}
          />
        </div>
      )}
    </>
  );
}

export default Store;
