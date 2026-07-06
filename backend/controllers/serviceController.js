const { Service } = require("../models");

const getServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: {
        is_active: true,
      },
      order: [["created_at", "DESC"]],
    });

    res.json({
      message: "Services fetched successfully",
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

const createService = async (req, res) => {
  try {
    const { name, unit_type, price } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Service name is required",
      });
    }

    if (!unit_type) {
      return res.status(400).json({
        message: "Unit type is required",
      });
    }

    if (!["kg", "item", "pair"].includes(unit_type)) {
      return res.status(400).json({
        message: "Unit type must be kg, item, or pair",
      });
    }

    if (!price || Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0",
      });
    }

    const service = await Service.create({
      name,
      unit_type,
      price,
    });

    res.status(201).json({
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create service",
      error: error.message,
    });
  }
};

module.exports = {
  getServices,
  createService,
};
