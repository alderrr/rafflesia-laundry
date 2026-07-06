const { Customer } = require("../models");

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      order: [["created_at", "DESC"]],
    });

    res.json({
      message: "Customers fetched successfully",
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, phone, address, notes } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Customer name is required",
      });
    }

    const customer = await Customer.create({
      name,
      phone,
      address,
      notes,
    });

    res.status(201).json({
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create customer",
      error: error.message,
    });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
};
