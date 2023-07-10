import Users from "../models/UsersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

export const searchUsers = async (req, res) => {
  const search = req.query.search_query || "";
  const result = await Users.findAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            {
              id: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              username: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              email: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
        {
          role: "user",
        },
      ],
    },
  });
  res.json({
    result: result,
  });
};

export const Register = async (req, res) => {
  const { username, email, password, confPassword, role } = req.body;
  // Memeriksa apakah username sudah ada dalam database
  const existingUser = await Users.findOne({ where: { username: username } });
  if (existingUser) {
    return res.status(400).json({ msg: "Username sudah digunakan" });
  }
  // Memeriksa apakah email sudah ada dalam database
  const existingEmail = await Users.findOne({ where: { email: email } });
  if (existingEmail) {
    return res.status(400).json({ msg: "Email sudah digunakan" });
  }

  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      username: username,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const userId = user[0].id;
    const username = user[0].username;
    const email = user[0].email;
    const accessToken = jwt.sign(
      { userId, username, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "60d",
      }
    );
    const refreshToken = jwt.sign(
      { userId, username, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "90d",
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 60 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email tidak ditemukan" });
  }
};

export const AdminLogin = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
        role: "admin",
      },
    });

    if (!user) {
      return res.status(400).json({ msg: "Anda bukan admin!" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const userId = user.id;
    const username = user.username;
    const email = user.email;
    const accessToken = jwt.sign(
      { userId, username, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      { userId, username, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      profilePic,
      username,
      email,
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = req.body;

    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    if (profilePic) {
      await user.update({ profilePic });
    }

    if (username) {
      await user.update({ username });
    }

    if (email) {
      await user.update({ email });
    }

    if (currentPassword && newPassword && confirmNewPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Password saat ini salah" });
      }

      if (newPassword !== confirmNewPassword) {
        return res
          .status(400)
          .json({ msg: "Password baru dan konfirmasi tidak cocok" });
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(newPassword, salt);

      await user.update({ password: hashPassword });
    }

    res.json({ msg: "Berhasil mengubah data pengguna" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await Users.count({
      where: {
        role: "user",
      },
    });
    res.json({ totalUsers: totalUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }
    await user.destroy();
    res.json({ msg: "Akun berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
