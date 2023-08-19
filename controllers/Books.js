import Books from "../models/BooksModel.js";
import BookCategory from "../models/BookCategoryModel.js";
import { Op } from "sequelize";
import path from "path";
import { API } from "../utils/const.js";
import fs from "fs";

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
    include: [
      {
        model: BookCategory,
        as: "category",
        attributes: ["id", "category"],
      },
    ],
  });

  const formattedResult = result.map((book) => {
    return {
      id: book.id,
      image: book.image,
      cover: book.cover,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      descriptions: book.descriptions,
      page: book.page,
      updatedAt: book.updatedAt,
      categoryId: book.category.id,
      categoryName: book.category.category,
      createdAt: book.createdAt,
    };
  });

  res.json({
    result: formattedResult,
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

export const addBook = async (req, res) => {
  const title = req.body.title;
  const file = req.files ? req.files.file : null;
  const author = req.body.author;
  const publisher = req.body.publisher;
  const descriptions = req.body.descriptions;
  const page = req.body.page;
  const categoryId = req.body.categoryId;
  const defaultCover = `${API}/images/defaultCover.jpg`;

  if (file) {
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];
    const cover = `${API}/images/${fileName}`;

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        await Books.create({
          title: title,
          image: fileName,
          cover: cover,
          author: author,
          publisher: publisher,
          descriptions: descriptions,
          page: page,
          categoryId: categoryId,
        });
        res.status(201).json({ msg: "Berhasil Menambah Buku" });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server Error" });
      }
    });
  } else {
    try {
      await Books.create({
        title: title,
        image: "defaultCover.jpg",
        cover: defaultCover,
        author: author,
        publisher: publisher,
        descriptions: descriptions,
        page: page,
        categoryId: categoryId,
      });
      res.status(201).json({ msg: "Berhasil Menambah Buku" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
};

export const updateBook = async (req, res) => {
  const bookId = req.params.bookId;
  const title = req.body.title;
  const file = req.files ? req.files.file : null;
  const author = req.body.author;
  const publisher = req.body.publisher;
  const descriptions = req.body.descriptions;
  const page = req.body.page;
  const categoryId = req.body.categoryId;

  try {
    let book = await Books.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ msg: "Buku tidak ditemukan" });
    }

    if (file) {
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const allowedType = [".png", ".jpg", ".jpeg"];
      const cover = `${API}/images/${fileName}`;

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Images" });
      }

      if (fileSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
      }

      const filepath = `./public/images/${book.image}`;
      fs.unlinkSync(filepath);

      file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
          await book.update({
            title: title,
            image: fileName,
            cover: cover,
            author: author,
            publisher: publisher,
            descriptions: descriptions,
            page: page,
            categoryId: categoryId,
          });
          res.json({ msg: "Buku berhasil diupdate" });
        } catch (error) {
          console.log(error.message);
          res.status(500).json({ msg: "Server Error" });
        }
      });
    } else {
      await book.update({
        title: title,
        author: author,
        publisher: publisher,
        descriptions: descriptions,
        page: page,
        categoryId: categoryId,
      });
      res.json({ msg: "Buku berhasil diupdate" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const book = await Books.findByPk(bookId);
    const filepath = `./public/images/${book.image}`;
    fs.unlinkSync(filepath);
    if (!book) {
      return res.status(404).json({ msg: "Buku tidak ditemukan" });
    }
    await book.destroy();
    res.json({ msg: "Buku berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
