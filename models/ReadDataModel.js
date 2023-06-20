import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Books from "./BooksModel.js";

const { DataTypes } = Sequelize;

const ReadData = db.define(
  "read_data",
  {
    status: {
      type: DataTypes.ENUM("Sedang Dibaca", "Sudah Dibaca"),
    },
    lastPage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startReading: {
      type: DataTypes.DATE,
    },
    target: {
      type: DataTypes.DATE,
    },
    lastRead: {
      type: DataTypes.DATE,
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

ReadData.belongsTo(Books, { foreignKey: "bookId" });

export default ReadData;
