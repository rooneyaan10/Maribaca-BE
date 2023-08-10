import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";
import BookCategory from "./BookCategoryModel.js";

const { Model } = Sequelize;

class Books extends Model {}

Books.init(
  {
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
    sequelize: db,
    modelName: "books",
    freezeTableName: true,
    timestamps: true,
  }
);

Books.belongsTo(BookCategory, { foreignKey: "categoryId", as: "category" });

export default Books;
