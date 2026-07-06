const { Customer, Service, Order } = require("../models");

const generateOrderCode = () => {
  const now = new Date();

  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const time = String(now.getTime()).slice(-5);

  return `LD${year}${month}${day}${time}`;
};

const createOrder = async (req, res) => {
  try {
    const { customer_id, service_id, quantity, estimated_finish_at, notes } =
      req.body;

    if (!customer_id) {
      return res.status(400).json({
        message: "Customer ID is required",
      });
    }

    if (!service_id) {
      return res.status(400).json({
        message: "Service ID is required",
      });
    }

    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const customer = await Customer.findByPk(customer_id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const service = await Service.findByPk(service_id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    if (!service.is_active) {
      return res.status(400).json({
        message: "This service is currently inactive",
      });
    }

    const unitPrice = service.price;
    const totalPrice = Math.round(Number(quantity) * unitPrice);

    const order = await Order.create({
      order_code: generateOrderCode(),
      customer_id,
      service_id,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      estimated_finish_at,
      notes,
    });

    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: Customer,
          as: "customer",
        },
        {
          model: Service,
          as: "service",
        },
      ],
    });

    res.status(201).json({
      message: "Order created successfully",
      data: createdOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Customer,
          as: "customer",
        },
        {
          model: Service,
          as: "service",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Customer,
          as: "customer",
        },
        {
          model: Service,
          as: "service",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "received",
      "washing",
      "drying",
      "ironing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    if (status === "completed") {
      order.completed_at = new Date();
    }

    await order.save();

    res.json({
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    const allowedPaymentStatuses = ["unpaid", "paid", "partial"];

    if (!allowedPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.payment_status = payment_status;

    await order.save();

    res.json({
      message: "Payment status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
};
