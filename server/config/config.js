require("dotenv").config();

module.exports.development = {
  dialect: "postgres",
  seederStorage: "sequelize",
  url: process.env.DB_URI
};