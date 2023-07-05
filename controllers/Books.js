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

export const addBooks = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  const title = req.body.title;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const host = "http://10.0.2.2:5000";
  const cover = `${host}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];
  const link = req.body.link;
  const author = req.body.author;
  const publisher = req.body.publisher;
  const descriptions = req.body.descriptions;
  const page = req.body.page;
  const categoryId = req.body.categoryId;

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
        link: link,
        author: author,
        publisher: publisher,
        descriptions: descriptions,
        page: page,
        categoryId: categoryId,
      });
      res.status(201).json({ msg: "Berhasil Menambah Buku" });
    } catch (error) {
      console.log(error.message);
    }
  });
};
