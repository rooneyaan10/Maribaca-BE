import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import router from "./routes/index.js";
// import Books from "./models/BooksModel.js";

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log("Database Connected");
  // await Books.sync();
} catch (error) {
  console.error(error);
}

app.get("/", (req, res) => {
  res.status(200).json({
    error: false,
    status: 200,
    message: "test",
  });
});

app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, () => console.log("Server running at port 5000"));
