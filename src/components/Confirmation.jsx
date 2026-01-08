import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";

function Confirmation() {
  const location = useLocation();
  const order = location.state?.order;

  // If someone navigates directly to /confirmation
  // without completing a purchase, redirect back to store
  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1 className="text-3xl my-5">Order Confirmed ✅</h1>

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

      <Link
        to="/"
        className="inline-block px-4 py-2 btn btn-outline-primary text-blue rounded"
      >
        ← Back to Store
      </Link>
    </div>
  );
}

export default Confirmation;
