"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Store, {
        foreignKey: "store_id",
        targetKey: "id",
      });
      this.belongsTo(models.Product, {
        foreignKey: "product_id",
        targetKey: "id",
      });
    }
  }
  Stock.init(
    {
      product_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Stock",
      tableName: "stocks",
    }
  );
  return Stock;
};
