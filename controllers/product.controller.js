import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import paginateResults from "../utils/pagination.js";
import { AppError } from "../utils/errorHandlers.js";
import ProductModel from "../models/product.model.js";

export const getAllProducts = expressAsyncHandler(async (req, res) => {
  const { results, pagination } = await paginateResults(ProductModel, req, {
    sort: req.query.sort || "-createdAt",
    select: req.query.fields || "",
    populate: [
      { path: "category", select: "name -_id" },
      { path: "brand", select: "name -_id" },
      { path: "subCategories", select: "name -_id" },
    ],
  });

  console.log("Products ARE : ", results);
  res.status(200).json({
    success: true,
    pagination,
    results,
  });
});

export const getSingleProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id).populate([
    { path: "category", select: "name -_id" },
    { path: "brand", select: "name -_id" },
    { path: "subCategories", select: "name -_id" },
  ]);

  console.log("Single Product is : ", product);

  if (!product) {
    return next(new AppError(`product not found for this id ${id}`, 404));
  }

  res.status(200).json({ product });
});

export const createProduct = expressAsyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    price,
    price_after_discount: priceAfterDiscount,
    colors,
    image,
    quantity,
    sold,
    category,
    subCategories,
    brand,
    ratingsAverage,
    ratingsQuantity,
    isActive,
  } = req.body;

  const product = await ProductModel.create({
    title,
    slug: slugify(title),
    description,
    price,
    price_after_discount: priceAfterDiscount,
    colors,
    image,
    quantity,
    subCategories,
    sold,
    category,
    brand,
    ratingsAverage,
    ratingsQuantity,
    isActive,
  });

  return res.status(201).json({
    status: 201,
    message: "Success Create",
    product,
  });
});

export const updateProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const updateData = { ...req.body };

  if (updateData.title) {
    updateData.slug = slugify(updateData.title);
  }

  const product = await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError(`Product not found for this id: ${id}`, 404));
  }

  return res.status(200).json({
    status: 200,
    message: "Success Update",
    product,
  });
});

export const deleteProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) {
    return next(new AppError(`product not found for this id ${id}`, 404));
  }

  return res.status(204).json({
    status: 204,
    message: "Success Deleted",
  });
});
