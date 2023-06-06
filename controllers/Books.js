import Books from "../models/BooksModel.js";
import { Op } from "sequelize";

export const searchBooks = async (req, res) => {
  const search = req.query.search_query || "";
  const result = await Books.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          author: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
  });
  res.json({
    result: result,
  });
};
