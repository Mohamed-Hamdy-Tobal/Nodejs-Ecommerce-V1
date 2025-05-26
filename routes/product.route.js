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

const router = express.Router();

router.route("/").get(getAllProducts).post(createProductValidation, createProduct);

router
  .route("/:id")
  .get(getProductValidation, getSingleProduct)
  .put(updateProductValidation, updateProduct)
  .delete(deleteProductValidation, deleteProduct);

export const productRouter = router;
