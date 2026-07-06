import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function NewOrder() {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    customer_id: "",
    service_id: "",
    quantity: "",
    estimated_finish_at: "",
    notes: "",
  });

  const [selectedService, setSelectedService] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  const fetchInitialData = async () => {
    try {
      setLoadingData(true);
      setErrorMessage("");

      const [customersResponse, servicesResponse] = await Promise.all([
        api.get("/api/customers"),
        api.get("/api/services"),
      ]);

      setCustomers(customersResponse.data.data);
      setServices(servicesResponse.data.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to load form data",
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const service = services.find(
      (serviceItem) => serviceItem.id === formData.service_id,
    );

    setSelectedService(service || null);
  }, [formData.service_id, services]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const resetForm = () => {
    setFormData({
      customer_id: "",
      service_id: "",
      quantity: "",
      estimated_finish_at: "",
      notes: "",
    });

    setSelectedService(null);
  };

  const totalPrice =
    selectedService && Number(formData.quantity) > 0
      ? Math.round(Number(formData.quantity) * Number(selectedService.price))
      : 0;

  const formatCurrency = (value) => {
    return `Rp${Number(value).toLocaleString("id-ID")}`;
  };

  const formatUnitLabel = (unitType) => {
    if (unitType === "kg") return "kg";
    if (unitType === "item") return "item";
    if (unitType === "pair") return "pair";
    return unitType || "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.customer_id) {
      setErrorMessage("Please select a customer");
      return;
    }

    if (!formData.service_id) {
      setErrorMessage("Please select a service");
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setErrorMessage("Quantity must be greater than 0");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");
      setCreatedOrder(null);

      const response = await api.post("/api/orders", {
        customer_id: formData.customer_id,
        service_id: formData.service_id,
        quantity: Number(formData.quantity),
        estimated_finish_at: formData.estimated_finish_at || null,
        notes: formData.notes,
      });

      setCreatedOrder(response.data.data);
      setSuccessMessage("Order created successfully");
      resetForm();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to create order",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="p-6">
        <p className="text-slate-600">Loading new order form...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Order</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create a new laundry order.
          </p>
        </div>

        <Link
          to="/orders"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          View Orders
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Order Details
            </h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Customer
                </label>

                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
                >
                  <option value="">Select customer</option>

                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                      {customer.phone ? ` - ${customer.phone}` : ""}
                    </option>
                  ))}
                </select>

                {customers.length === 0 && (
                  <p className="mt-2 text-xs text-red-600">
                    No customers found. Add a customer first.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Service
                </label>

                <select
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
                >
                  <option value="">Select service</option>

                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {formatCurrency(service.price)} /{" "}
                      {formatUnitLabel(service.unit_type)}
                    </option>
                  ))}
                </select>

                {services.length === 0 && (
                  <p className="mt-2 text-xs text-red-600">
                    No services found. Add a service first.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Example: 3.5"
                  min="0"
                  step="0.1"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                />

                {selectedService && (
                  <p className="mt-1 text-xs text-slate-500">
                    Unit: {formatUnitLabel(selectedService.unit_type)}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Estimated Finish Date
                </label>

                <input
                  type="datetime-local"
                  name="estimated_finish_at"
                  value={formData.estimated_finish_at}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Example: Separate white clothes, use softener, express request..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                />
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
                disabled={
                  submitting || customers.length === 0 || services.length === 0
                }
                className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting ? "Creating Order..." : "Create Order"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Price Summary
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Service</span>
                <span className="text-sm font-medium text-slate-900">
                  {selectedService ? selectedService.name : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Unit Price</span>
                <span className="text-sm font-medium text-slate-900">
                  {selectedService
                    ? `${formatCurrency(selectedService.price)} / ${formatUnitLabel(
                        selectedService.unit_type,
                      )}`
                    : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Quantity</span>
                <span className="text-sm font-medium text-slate-900">
                  {formData.quantity || "0"}{" "}
                  {selectedService
                    ? formatUnitLabel(selectedService.unit_type)
                    : ""}
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total Price</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {formatCurrency(totalPrice)}
                </p>
              </div>
            </div>
          </div>

          {createdOrder && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-green-900">
                Order Created
              </h2>

              <div className="mt-4 space-y-2 text-sm text-green-800">
                <p>
                  <span className="font-medium">Order Code:</span>{" "}
                  {createdOrder.order_code}
                </p>

                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {createdOrder.customer?.name || "-"}
                </p>

                <p>
                  <span className="font-medium">Service:</span>{" "}
                  {createdOrder.service?.name || "-"}
                </p>

                <p>
                  <span className="font-medium">Total:</span>{" "}
                  {formatCurrency(createdOrder.total_price)}
                </p>
              </div>

              <Link
                to="/orders"
                className="mt-4 inline-block rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
              >
                Go to Orders
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewOrder;
