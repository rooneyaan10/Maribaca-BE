// controllers/ReadData.js
import ReadData from "../models/ReadDataModel.js";
import Books from "../models/BooksModel.js";

export const getReadDataByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Ambil user ID dari parameter URL
    const readData = await ReadData.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: Books,
          attributes: ["id", "title", "author"],
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
