const { Op } = require("sequelize");
const { Customer, Service, Order } = require("../models");

const getJakartaTodayRange = () => {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(now);

  const year = parts.find((part) => part.type === "year").value;
  const month = parts.find((part) => part.type === "month").value;
  const day = parts.find((part) => part.type === "day").value;

  const start = new Date(`${year}-${month}-${day}T00:00:00.000+07:00`);
  const end = new Date(`${year}-${month}-${day}T23:59:59.999+07:00`);

  return { start, end };
};

const getTodayReport = async (req, res) => {
  try {
    const { start, end } = getJakartaTodayRange();

    const todayWhere = {
      received_at: {
        [Op.between]: [start, end],
      },
      status: {
        [Op.ne]: "cancelled",
      },
    };

    const totalOrdersToday = await Order.count({
      where: todayWhere,
    });

    const totalSalesToday = await Order.sum("total_price", {
      where: todayWhere,
    });

    const paidRevenueToday = await Order.sum("total_price", {
      where: {
        ...todayWhere,
        payment_status: "paid",
      },
    });

    const unpaidOrders = await Order.count({
      where: {
        payment_status: "unpaid",
        status: {
          [Op.ne]: "cancelled",
        },
      },
    });

    const readyOrders = await Order.count({
      where: {
        status: "ready",
      },
    });

    const inProgressOrders = await Order.count({
      where: {
        status: {
          [Op.in]: ["received", "washing", "drying", "ironing"],
        },
      },
    });

    const completedToday = await Order.count({
      where: {
        completed_at: {
          [Op.between]: [start, end],
        },
        status: "completed",
      },
    });

    const recentOrders = await Order.findAll({
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
      limit: 5,
    });

    res.json({
      message: "Today's report fetched successfully",
      data: {
        date_timezone: "Asia/Jakarta",
        start,
        end,
        total_orders_today: totalOrdersToday,
        total_sales_today: Number(totalSalesToday) || 0,
        paid_revenue_today: Number(paidRevenueToday) || 0,
        unpaid_orders: unpaidOrders,
        ready_orders: readyOrders,
        in_progress_orders: inProgressOrders,
        completed_today: completedToday,
        recent_orders: recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch today's report",
      error: error.message,
    });
  }
};

module.exports = {
  getTodayReport,
};
