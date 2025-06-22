import slugify from "slugify";
import CategoryModel from "../models/category.model.js";
import expressAsyncHandler from "express-async-handler";
import paginateResults from "../utils/pagination.js";
import { AppError } from "../utils/errorHandlers.js";
import { FilterFactory } from "../utils/filters/filterFactory.js";

export const getAllCategories = expressAsyncHandler(async (req, res) => {
  const categoriesFilter = FilterFactory.getFilter("categories");
  const { filter, sort, select } = categoriesFilter(req.query);

  const { results, pagination } = await paginateResults(CategoryModel, req, {
    filter,
    sort,
    select,
  });

  res.status(200).json({
    success: true,
    pagination,
    results,
  });
});

export const getSingleCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);

  if (!category) {
    return next(new AppError(`category not found for this id ${id}`, 404));
  }

  res.status(200).json({ category });
});

export const createCategory = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await CategoryModel.create({
    name,
    slug: slugify(name),
  });
  return res.status(201).json({
    status: 201,
    message: "Success Create",
    category,
  });
});

export const updateCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await CategoryModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!category) {
    return next(new AppError(`category not found for this id ${id}`, 404));
  }

  return res.status(200).json({
    status: 200,
    message: "Success Update",
    category,
  });
});

export const deleteCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findByIdAndDelete(id);

  if (!category) {
    return next(new AppError(`category not found for this id ${id}`, 404));
  }

  return res.status(204).json({
    status: 204,
    message: "Success Deleted",
  });
});
