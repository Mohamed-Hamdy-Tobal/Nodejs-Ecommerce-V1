import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import {
  createProductValidation,
  deleteProductValidation,
  getProductValidation,
  updateProductValidation,
} from "../validation/productValidation.js";
import { adminProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").get(getAllProducts).post(adminProtect, createProductValidation, createProduct);

router
  .route("/:id")
  .get(getProductValidation, getSingleProduct)
  .put(adminProtect, updateProductValidation, updateProduct)
  .delete(adminProtect, deleteProductValidation, deleteProduct);

export const productRouter = router;
