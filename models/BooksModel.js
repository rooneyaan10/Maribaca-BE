import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import BookCategory from "./BookCategoryModel.js";

const { DataTypes } = Sequelize;

const Books = db.define(
  "books",
  {
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    cover: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
    },
    publisher: {
      type: DataTypes.STRING,
    },
    descriptions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    page: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "book_category",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

Books.belongsTo(BookCategory, { foreignKey: "categoryId" });

export default Books;
