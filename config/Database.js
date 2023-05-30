import { Sequelize } from "sequelize";

const db = new Sequelize("maribaca", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
