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
      attributes: ["status", "lastPage", "startReading", "doneReading"],
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
            "link",
          ],
        },
      ],
      attributes: ["status", "lastPage", "startReading", "doneReading"],
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
    const { doneReading } = req.body;

    const currentDate = new Date();
    const doneReadingDate = new Date(doneReading);
    doneReadingDate.setHours(currentDate.getHours());
    doneReadingDate.setMinutes(currentDate.getMinutes());
    doneReadingDate.setSeconds(currentDate.getSeconds());

    await ReadData.create({
      status: "Sedang Dibaca",
      lastPage: 1,
      startReading: currentDate,
      doneReading: doneReadingDate,
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

    if (lastPage >= book.page) {
      await readData.update({
        lastPage: lastPage,
        status: "Sudah Dibaca",
      });
    } else {
      await readData.update({
        lastPage: lastPage,
      });
    }

    res.json({ msg: "Berhasil memperbarui halaman terakhir yang dibaca" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
