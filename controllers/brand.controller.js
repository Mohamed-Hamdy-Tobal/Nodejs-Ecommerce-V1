import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import paginateResults from "../utils/pagination.js";
import { AppError } from "../utils/errorHandlers.js";
import BrandModel from "../models/brand.model.js";

export const getAllBrands = expressAsyncHandler(async (req, res) => {
  const { results, pagination } = await paginateResults(BrandModel, req, {
    sort: req.query.sort || "-createdAt",
    select: req.query.fields || "",
  });

  console.log("Brands ARE : ", results);
  res.status(200).json({
    success: true,
    pagination,
    results,
  });
});

export const getSingleBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandModel.findById(id);

  console.log("Single Brand is : ", brand);

  if (!brand) {
    return next(new AppError(`brand not found for this id ${id}`, 404));
  }

  res.status(200).json({ brand });
});

export const createBrand = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await BrandModel.create({
    name,
    slug: slugify(name),
  });
  return res.status(201).json({
    status: 201,
    message: "Success Create",
    brand,
  });
});

export const updateBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await BrandModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!brand) {
    return next(new AppError(`brand not found for this id ${id}`, 404));
  }

  return res.status(200).json({
    status: 200,
    message: "Success Update",
    brand,
  });
});

export const deleteBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findByIdAndDelete(id);

  if (!brand) {
    return next(new AppError(`brand not found for this id ${id}`, 404));
  }

  return res.status(204).json({
    status: 204,
    message: "Success Deleted",
  });
});
