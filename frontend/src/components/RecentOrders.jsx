function RecentOrders({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>

        <p className="mt-3 text-sm text-slate-500">No recent orders yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-3">Order</th>
              <th className="py-3">Customer</th>
              <th className="py-3">Service</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100">
                <td className="py-3 font-medium text-slate-900">
                  {order.order_code}
                </td>

                <td className="py-3 text-slate-600">
                  {order.customer?.name || "-"}
                </td>

                <td className="py-3 text-slate-600">
                  {order.service?.name || "-"}
                </td>

                <td className="py-3 text-slate-600 capitalize">
                  {order.status}
                </td>

                <td className="py-3 text-right font-medium text-slate-900">
                  Rp{Number(order.total_price).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;
