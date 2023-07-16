import Recommendations from "../models/RecommendationsModel.js";
import Books from "../models/BooksModel.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const recommendations = await Recommendations.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: Books,
          attributes: ["id", "title", "author", "cover", "page"],
        },
      ],
      attributes: ["bookId"],
    });

    res.json(recommendations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
