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
