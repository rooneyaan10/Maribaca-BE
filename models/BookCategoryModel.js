import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";

const { Model } = Sequelize;

class BookCategory extends Model {}

BookCategory.init(
  {
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "book_category",
    freezeTableName: true,
  }
);

export default BookCategory;
