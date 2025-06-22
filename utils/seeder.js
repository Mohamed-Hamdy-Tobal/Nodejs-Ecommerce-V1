import colors from "colors";
import fs from "node:fs";
import { connectDB } from "../database/dbConnection.js";
import ProductModel from "../models/product.model.js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

connectDB();

const products = JSON.parse(fs.readFileSync("../data/products.json"));

// Insert data into DB
const insertData = async () => {
  try {
    await ProductModel.create(products);

    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await ProductModel.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  // node seeder.js -i => -i is index 2
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
