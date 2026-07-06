import { useEffect, useState } from "react";
import api from "../api/api";
import StatCard from "../components/StatCard";
import RecentOrders from "../components/RecentOrders";

function Dashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTodayReport = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/api/reports/today");

      setReport(response.data.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to fetch dashboard data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayReport();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-600">Loading dashboard...</p>
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
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

          <p className="mt-1 text-sm text-slate-500">
            Today’s laundry business summary
          </p>
        </div>

        <button
          onClick={fetchTodayReport}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Orders"
          value={report.total_orders_today}
          subtitle="Orders received today"
        />

        <StatCard
          title="Today's Sales"
          value={`Rp${Number(report.total_sales_today).toLocaleString("id-ID")}`}
          subtitle="Total order value"
        />

        <StatCard
          title="Paid Revenue"
          value={`Rp${Number(report.paid_revenue_today).toLocaleString("id-ID")}`}
          subtitle="Paid orders today"
        />

        <StatCard
          title="Unpaid Orders"
          value={report.unpaid_orders}
          subtitle="All unpaid active orders"
        />

        <StatCard
          title="Ready Orders"
          value={report.ready_orders}
          subtitle="Ready for pickup"
        />

        <StatCard
          title="In Progress"
          value={report.in_progress_orders}
          subtitle="Received, washing, drying, ironing"
        />

        <StatCard
          title="Completed Today"
          value={report.completed_today}
          subtitle="Finished orders"
        />
      </div>

      <div className="mt-6">
        <RecentOrders orders={report.recent_orders} />
      </div>
    </div>
  );
}

export default Dashboard;
