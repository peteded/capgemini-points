import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { calculateBuyerPoints } from "../points/points";
import { loadTransactions } from "../transactions/transactions";
import { totalPoints3months } from "../points/totalPoints";


function Confirmation() {
  const location = useLocation();
  const order = location.state?.order;

  // direct to confirm error / no pruchase
  if (!order) {
    return <Navigate to="/" replace />;
  }

  // points reciept 

  const transactions = loadTransactions();

const { filtered, months, monthKeys, totalPoints } =
  totalPoints3months(transactions, order.customerId);

const customerName = order.customerName;


  return (
    <>
    <div className="row">
    <div className="col-md-6">
      <h1 className="text-3xl my-5">Order Confirmed</h1>

      <p className="mb-4">
        Thanks for your purchase! Your order has been successfully placed.
      </p>

      <div className="mb-4">
        <strong>Order ID:</strong> {order.id}
      </div>

      <h2 className="text-xl mb-2">Items</h2>
      <ul className="mb-4">
        {order.items.map((item) => (
          <li key={item.name}>
            {item.qty} × {item.name} — $
            {(item.qty * item.price).toFixed(2)}
          </li>
        ))}
      </ul>

      <p className="text-lg mb-6">
        <strong>Total:</strong> ${order.total.toFixed(2)}
      </p>
      <p className="text-lg mb-6">
        <strong>Recent Points:</strong> {order.points}
        </p>

      <Link
        to="/"
        className="inline-block px-4 py-2 btn btn-outline-primary text-blue rounded"
      >
        Back to Store
      </Link>
    </div>
    <div className="col-md-6 mt-5">
    <hr style={{ margin: "16px 0" }} />

<h3 style={{ margin: "0 0 8px" }}>
  Points (last 3 months){customerName ? `: ${customerName}` : ""}
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
</div>
</div>
    </>
  );
}

export default Confirmation;
