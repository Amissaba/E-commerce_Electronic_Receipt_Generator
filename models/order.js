'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.Customer, { 
        foreignKey: 'customer_id', 
        as: 'customer',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      // define association here
    }
  }
  Order.init({
    order_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    customer_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_data: {
      type: DataTypes.JSON,
      allowNull: false
    },
    order_status: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    delivery_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0
    },
    receipt_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    totalamount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    issued_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    }
    
    
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    timestamps: false
  });
  return Order;
};