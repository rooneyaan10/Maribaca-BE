import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Books from "./BooksModel.js";

const { DataTypes } = Sequelize;

const Recommendations = db.define(
  "recommendations",
  {
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "books",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Recommendations.belongsTo(Books, { foreignKey: "bookId" });

export default Recommendations;
