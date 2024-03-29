import Users from "../models/UsersModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.SendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.SendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decode) => {
        if (err) return res.SendStatus(403);
        const userId = user[0].id;
        const username = user[0].username;
        const email = user[0].email;
        const password = user[0].password;
        const accessToken = jwt.sign(
          { userId, username, email, password, id: user[0].id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "24h",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
