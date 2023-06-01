import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const ReadData = db.define(
  "read_data",
  {
    status: {
      type: DataTypes.ENUM("Ingin Dibaca", "Sedang Dibaca", "Sudah Dibaca"),
    },
    lastPage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startReading: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    doneReading: {
      type: DataTypes.DATE,
      allowNull: true,
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

export default ReadData;
