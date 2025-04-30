import express from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
} from "../controllers/brand.controller.js";
import {
  createBrandValidation,
  deleteBrandValidation,
  getBrandValidation,
  updateBrandValidation,
} from "../validation/brandValidation.js";

const router = express.Router();

router.route("/").get(getAllBrands).post(createBrandValidation, createBrand);

router
  .route("/:id")
  .get(getBrandValidation, getSingleBrand)
  .put(updateBrandValidation, updateBrand)
  .delete(deleteBrandValidation, deleteBrand);

export const brandRouter = router;
