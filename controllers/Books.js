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

export const getTotalBooks = async (req, res) => {
  try {
    const totalBooks = await Books.count();
    res.json({ totalBooks: totalBooks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
