import ReadData from "../models/ReadDataModel.js";
import Books from "../models/BooksModel.js";

export const getCurrentlyRead = async (req, res) => {
  try {
    const userId = req.params.userId; // Ambil user ID dari parameter URL
    const readData = await ReadData.findAll({
      where: {
        userId: userId,
        status: "Sedang Dibaca",
      },
      include: [
        {
          model: Books,
          attributes: ["id", "title", "author", "cover", "page"],
        },
      ],
      attributes: ["status", "lastPage", "startReading", "lastRead", "target"],
    });

    res.json(readData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const getDoneRead = async (req, res) => {
  try {
    const userId = req.params.userId; // Ambil user ID dari parameter URL
    const readData = await ReadData.findAll({
      where: {
        userId: userId,
        status: "Sudah Dibaca",
      },
      include: [
        {
          model: Books,
          attributes: [
            "id",
            "title",
            "author",
            "cover",
            "page",
            "publisher",
            "descriptions",
            "categoryId",
          ],
        },
      ],
      attributes: [
        "status",
        "lastPage",
        "startReading",
        "target",
        "lastRead",
        "createdAt",
        "updatedAt",
      ],
    });

    res.json(readData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const startRead = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookId = req.params.bookId;
    const { target } = req.body;

    const currentDate = new Date();
    const targetReadingDate = new Date(target);
    targetReadingDate.setHours(currentDate.getHours());
    targetReadingDate.setMinutes(currentDate.getMinutes());
    targetReadingDate.setSeconds(currentDate.getSeconds());

    await ReadData.create({
      status: "Sedang Dibaca",
      lastPage: 1,
      startReading: currentDate,
      target: target,
      lastRead: currentDate,
      userId: userId,
      bookId: bookId,
    });

    res.json({ msg: "berhasil menambah data" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "gagal" });
  }
};

export const updatePage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookId = req.params.bookId;
    const { lastPage } = req.body;

    const readData = await ReadData.findOne({
      where: {
        userId: userId,
        bookId: bookId,
        status: "Sedang Dibaca",
      },
    });

    if (!readData) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    const book = await Books.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ msg: "Buku tidak ditemukan" });
    }

    if (parseInt(lastPage) > parseInt(book.page)) {
      return res
        .status(400)
        .json({ msg: "Jumlah halaman melebihi jumlah halaman buku" });
    }

    if (parseInt(lastPage) === parseInt(book.page)) {
      await readData.update({
        lastPage: lastPage,
        status: "Sudah Dibaca",
        lastRead: new Date(),
      });
    } else {
      await readData.update({
        lastPage: lastPage,
        lastRead: new Date(),
      });
    }

    res.json({ msg: "Berhasil memperbarui halaman terakhir yang dibaca" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const getTotalReadBooks = async (req, res) => {
  try {
    const userId = req.params.userId;

    const totalReadBooks = await ReadData.count({
      where: {
        userId: userId,
        status: "Sudah Dibaca",
      },
    });

    res.json({ totalReadBooks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
