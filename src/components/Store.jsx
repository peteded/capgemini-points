import React, { useEffect, useState } from "react";
import { fetchAllPrices } from "../api/storeApi";
import Checkout from "./Checkout";
import { useNavigate } from "react-router-dom";
import { createTransaction } from "../models/transaction";
import { addTransaction, loadTransactions } from "../transactions/transactions";
import { calculateBuyerPoints } from "../points/points";


const CUSTOMER_SESSION_KEY = "buyer_points_selected_customer";

function Store() {
  const items = ["shirt", "pants", "shoes", "socks", "hat"];

  const customers = [
  { id: "cust_1", name: "Peter" },
  { id: "cust_2", name: "Jain" },
];

const [customerId, setCustomerId] = useState(() => {
  try {
    const saved = sessionStorage.getItem(CUSTOMER_SESSION_KEY);
    const isValid = customers.some((c) => c.id === saved);
    return isValid ? saved : customers[0].id;
  } catch {
    return customers[0].id;
  }
});


const customer = customers.find((c) => c.id === customerId) ?? customers[0];


  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchaseError, setPurchaseError] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [cart, setCart] = useState([]);

  const navigate = useNavigate();
const [purchasing, setPurchasing] = useState(false);

// simulating submitting a BE order
function submitOrder(order) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.15) {
        reject(new Error("Payment failed. Please try again."));
        return;
      }
      resolve({ ok: true });
    }, 800);
  });
}

  // selected customer
  useEffect(() => {
  try {
    sessionStorage.setItem(CUSTOMER_SESSION_KEY, customerId);
  } catch {}
}, [customerId]);



  // price

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

  // transact
  useEffect(() => {
  setTransactions(loadTransactions());
}, []);

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

  setPurchaseError("");
  setPurchasing(true);

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  const points = calculateBuyerPoints(total);

  const txn = createTransaction({
    customerId: customer.id,
    customerName: customer.name,
    items: cart,
    total,
    points,
  });

  try {
  await submitOrder(txn);
  const next = addTransaction(txn);
  setTransactions(next);
  clearCart();
  navigate("/confirmation", { state: { order: txn } });
} catch (err) {
  setPurchaseError(err.message || "This order did Not go through.");
} finally {
  setPurchasing(false);
}

}



  return (
    <>
    <div className="row">
      <div className="col-md-9 col-sm-12 col-xs-12 w-xs-100">
      <h1 className="text-3xl my-5">Peter Apparel Store</h1>
      <label style={{ display: "block", marginBottom: 12 }}>
        Select a Customer{" "}
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>


      {loading && <p>Loading prices...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {purchaseError && (
        <p style={{ color: "red", marginBottom: 8 }}>
          {purchaseError}
        </p>
      )}


      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 16,
          }}
        >
          <div className="list-group list-group-horizontal-md">
            {items.map((item, index) => (
              <button
                key={item}
                type="button"
                className={
                  selectedIndex === index
                    ? "list-group-item list-group-item-action py-3 my-sm-1 my-xs-1 px-3 rounded mx-1 border border-secondary text-uppercase active"
                    : "list-group-item list-group-item-action py-3 my-sm-1 my-xs-1 px-3 rounded mx-1 border border-primary text-capitalize"
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

          

        </div>
      )}
      </div>
      <div className="col-md-3 col-sm-12 col-xs-12">
        <Checkout
          cart={cart}
          onAdd={addToCart}
          onRemoveOne={removeOne}
          onRemoveItem={removeItem}
          onClear={clearCart}
          onPurchase={handlePurchase}
          purchasing={purchasing}
          customer={customer}
          transactions={transactions}
        />
      </div>
      </div>
    </>
  );
}

export default Store;
