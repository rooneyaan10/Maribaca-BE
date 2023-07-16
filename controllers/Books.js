import Books from "../models/BooksModel.js";
import { Op } from "sequelize";
import path from "path";
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

export const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
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
  const host = "http://10.0.2.2:5005";
  const defaultCover = `${host}/images/defaultCover.jpg`;

  if (file) {
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];
    const cover = `${host}/images/${fileName}`;

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

export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const user = await Books.findByPk(bookId);
    if (!user) {
      return res.status(404).json({ msg: "Buku tidak ditemukan" });
    }
    await user.destroy();
    res.json({ msg: "Akun berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
