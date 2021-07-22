"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Todo extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
      // (no pun intended) TODO: Relate it to User Model in future iterations of the system.
			// define association here
		}
	}
	Todo.init(
		{
			id: {
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			content: {
				allowNull: false,
				type: DataTypes.STRING(512)
			},
			completed: {
				allowNull: false,
				type: DataTypes.BOOLEAN
			}
		},
		{
			sequelize,
			modelName: "Todo",
			timestamps: true
		}
	);
	return Todo;
};
