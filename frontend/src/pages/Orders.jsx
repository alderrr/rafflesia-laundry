import { useEffect, useState } from "react";
import api from "../api/api";

const orderStatuses = [
  "received",
  "washing",
  "drying",
  "ironing",
  "ready",
  "completed",
  "cancelled",
];

const paymentStatuses = ["unpaid", "partial", "paid"];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/api/orders");
      setOrders(response.data.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to fetch orders",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await api.patch(`/api/orders/${orderId}/status`, {
        status,
      });

      await fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId("");
    }
  };

  const updatePaymentStatus = async (orderId, payment_status) => {
    try {
      setUpdatingId(orderId);

      await api.patch(`/api/orders/${orderId}/payment`, {
        payment_status,
      });

      await fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update payment status");
    } finally {
      setUpdatingId("");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (value) => {
    return `Rp${Number(value).toLocaleString("id-ID")}`;
  };

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-600">Loading orders...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage laundry orders.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="p-6">
            <p className="text-slate-600">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-4 py-3">Order Code</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Order Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Received</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {order.order_code}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      <div className="font-medium text-slate-900">
                        {order.customer?.name || "-"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.customer?.phone || ""}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {order.service?.name || "-"}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {order.quantity} {order.service?.unit_type}
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatCurrency(order.total_price)}
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(event) =>
                          updateOrderStatus(order.id, event.target.value)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm capitalize text-slate-700 disabled:bg-slate-100"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={order.payment_status}
                        disabled={updatingId === order.id}
                        onChange={(event) =>
                          updatePaymentStatus(order.id, event.target.value)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm capitalize text-slate-700 disabled:bg-slate-100"
                      >
                        {paymentStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(order.received_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
