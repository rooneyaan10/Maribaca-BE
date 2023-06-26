import express from "express";
import {
  getUsers,
  Register,
  Login,
  Logout,
  updateUser,
} from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { searchBooks } from "../controllers/Books.js";
import {
  getCurrentlyRead,
  getDoneRead,
  startRead,
  updatePage,
  getTotalReadBooks, // Tambahkan ini
} from "../controllers/ReadData.js";

const router = express.Router();

router.get("/users", getUsers);
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);
router.get("/searchbooks", searchBooks);
router.get("/users/:userId/currentlyread", verifyToken, getCurrentlyRead);
router.get("/users/:userId/doneread", verifyToken, getDoneRead);
router.post("/users/:userId/books/:bookId/startread", verifyToken, startRead);
router.put("/users/:userId/books/:bookId/updatepage", verifyToken, updatePage);
router.put("/users/:userId/updateuser", verifyToken, updateUser);
router.get("/users/:userId/total-read-books", verifyToken, getTotalReadBooks);

export default router;
