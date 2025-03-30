"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "owner_id",
        targetKey: "id",
      });
    }
  }
  Store.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      owner_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Store",
      tableName: "stores",
    }
  );
  return Store;
};
