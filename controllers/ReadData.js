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
