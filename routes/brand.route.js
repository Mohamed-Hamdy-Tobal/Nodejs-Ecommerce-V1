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
import { adminProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").get(getAllBrands).post(adminProtect, createBrandValidation, createBrand);

router
  .route("/:id")
  .get(getBrandValidation, getSingleBrand)
  .put(adminProtect, updateBrandValidation, updateBrand)
  .delete(adminProtect, deleteBrandValidation, deleteBrand);

export const brandRouter = router;
