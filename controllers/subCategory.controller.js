import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import paginateResults from "../utils/pagination.js";
import { AppError } from "../utils/errorHandlers.js";
import SubCategoryModel from "../models/subCategory.model.js";
import { FilterFactory } from "../utils/filters/filterFactory.js";

export const getAllSubCategories = expressAsyncHandler(async (req, res) => {
  console.log("req.params : ", req.params);
  const categoriesFilter = FilterFactory.getFilter("categories");
  const { filter, sort, select } = categoriesFilter(req.query);
  const { categoryId } = req.params; // Extract categoryId from request parameters
  const param_filter = categoryId ? { category: categoryId } : {}; // Filter by category if categoryId is provided

  const { results, pagination } = await paginateResults(SubCategoryModel, req, {
    sort,
    select,
    populate: "category",
    filter: { ...filter, ...param_filter },
  });

  res.status(200).json({
    success: true,
    pagination,
    results,
  });
});

export const getSingleSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findById(id).populate({
    path: "category",
    select: "name -_id", // "name": include the name field from the populated category, "-_id": exclude the _id field from the populated category.
  });

  if (!subCategory) {
    return next(new AppError(`sub-category not found for this id ${id}`, 404));
  }

  res.status(200).json({ subCategory });
});

export const setCategoryID = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

export const createSubCategory = expressAsyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  return res.status(201).json({
    status: 201,
    message: "Success Create",
    subCategory,
  });
});

export const updateSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    id,
    { name, category, slug: slugify(name) },
    { new: true }
  );

  if (!subCategory) {
    return next(new AppError(`sub-category not found for this id ${id}`, 404));
  }

  return res.status(200).json({
    status: 200,
    message: "Success Update",
    subCategory,
  });
});

export const deleteSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategoryModel.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new AppError(`sub-category not found for this id ${id}`, 404));
  }

  return res.status(204).json({
    status: 204,
    message: "Success Deleted",
  });
});
