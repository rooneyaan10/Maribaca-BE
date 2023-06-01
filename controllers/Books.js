import Books from "../models/BooksModel.js";

export const getBooks = async (req, res) => {
  try {
    const books = await Books.findAll({
      attributes: [
        "id",
        "link",
        "cover",
        "title",
        "author",
        "publisher",
        "descriptions",
        "page",
        "categoryId",
      ],
    });
    res.json(books);
  } catch (error) {
    console.log(error);
  }
};
