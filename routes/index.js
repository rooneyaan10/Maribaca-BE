// routes/index.js
import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { searchBooks } from "../controllers/Books.js";
import {
  getCurrentlyRead,
  getDoneRead,
  startRead,
} from "../controllers/ReadData.js"; // Tambahkan ini

const router = express.Router();

router.get("/users", getUsers);
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);
router.get("/searchbooks", searchBooks);
router.get("/users/:userId/currentlyread", verifyToken, getCurrentlyRead); // Tambahkan ini
router.get("/users/:userId/doneread", verifyToken, getDoneRead);
router.post("/users/:userId/:bookId/startread", verifyToken, startRead);

export default router;
