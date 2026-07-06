import { useEffect, useState } from "react";
import api from "../api/api";

const unitTypes = ["kg", "item", "pair"];

function Services() {
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    unit_type: "kg",
    price: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/api/services");
      setServices(response.data.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to fetch services",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      unit_type: "kg",
      price: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage("Service name is required");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMessage("Price must be greater than 0");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      await api.post("/api/services", {
        name: formData.name,
        unit_type: formData.unit_type,
        price: Number(formData.price),
      });

      setSuccessMessage("Service added successfully");
      resetForm();
      await fetchServices();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to create service",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value) => {
    return `Rp${Number(value).toLocaleString("id-ID")}`;
  };

  const formatUnitLabel = (unitType) => {
    if (unitType === "kg") return "per kg";
    if (unitType === "item") return "per item";
    if (unitType === "pair") return "per pair";
    return unitType;
  };

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage laundry service types and prices.
          </p>
        </div>

        <button
          onClick={fetchServices}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Add Service
            </h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Service Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Regular Wash"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Unit Type
                </label>
                <select
                  name="unit_type"
                  value={formData.unit_type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
                >
                  {unitTypes.map((unitType) => (
                    <option key={unitType} value={unitType}>
                      {formatUnitLabel(unitType)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Example: 8000"
                  min="0"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Enter price in Rupiah, for example 8000.
                </p>
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting ? "Saving..." : "Add Service"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Service Price List
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Total active services: {services.length}
              </p>
            </div>

            {loading ? (
              <div className="p-5">
                <p className="text-slate-600">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="p-5">
                <p className="text-slate-600">No services yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Unit</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Created</th>
                    </tr>
                  </thead>

                  <tbody>
                    {services.map((service) => (
                      <tr
                        key={service.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">
                            {service.name}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {formatUnitLabel(service.unit_type)}
                        </td>

                        <td className="px-4 py-3 font-medium text-slate-900">
                          {formatCurrency(service.price)}
                        </td>

                        <td className="px-4 py-3">
                          <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {formatDate(service.createdAt || service.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Suggested Starter Services
            </h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium text-slate-900">Regular Wash</p>
                <p className="mt-1 text-sm text-slate-500">Rp8,000 per kg</p>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium text-slate-900">Express Wash</p>
                <p className="mt-1 text-sm text-slate-500">Rp12,000 per kg</p>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium text-slate-900">Ironing</p>
                <p className="mt-1 text-sm text-slate-500">Rp6,000 per kg</p>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium text-slate-900">Blanket</p>
                <p className="mt-1 text-sm text-slate-500">Rp25,000 per item</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
