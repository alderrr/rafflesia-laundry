const sequelize = require("../config/database");

const Customer = require("./Customer");
const Service = require("./Service");
const Order = require("./Order");

// Relationships
Customer.hasMany(Order, {
  foreignKey: "customer_id",
  as: "orders",
});

Order.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "customer",
});

Service.hasMany(Order, {
  foreignKey: "service_id",
  as: "orders",
});

Order.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
});

module.exports = {
  sequelize,
  Customer,
  Service,
  Order,
};
