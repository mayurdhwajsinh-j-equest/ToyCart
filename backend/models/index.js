const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false, // Set to console.log for query logging
});

// Import models
const User = require('./User')(sequelize);
const Category = require('./Category')(sequelize);
const Product = require('./Product')(sequelize);
const Cart = require('./Cart')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const Review = require('./Review')(sequelize);
const WishList = require('./WishList')(sequelize);

// Define Associations

// User associations
User.hasMany(Cart, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
User.hasMany(Order, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
User.hasMany(Review, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
User.hasMany(WishList, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Category associations
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Product associations
Product.belongsTo(Category, {
  foreignKey: 'categoryId',
});
Product.hasMany(Cart, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Product.hasMany(Review, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Product.hasMany(WishList, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Cart associations
Cart.belongsTo(User, {
  foreignKey: 'userId',
});
Cart.belongsTo(Product, {
  foreignKey: 'productId',
});

// Order associations
Order.belongsTo(User, {
  foreignKey: 'userId',
});
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// OrderItem associations
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
});
OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
});

// Review associations
Review.belongsTo(User, {
  foreignKey: 'userId',
});
Review.belongsTo(Product, {
  foreignKey: 'productId',
});

// WishList associations
WishList.belongsTo(User, {
  foreignKey: 'userId',
});
WishList.belongsTo(Product, {
  foreignKey: 'productId',
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Cart,
  Order,
  OrderItem,
  Review,
  WishList,
};
