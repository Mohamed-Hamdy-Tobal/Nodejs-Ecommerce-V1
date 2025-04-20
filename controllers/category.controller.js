import slugify from "slugify";
import CategoryModel from "../models/category.model.js";
import expressAsyncHandler from "express-async-handler";
import paginateResults from "../utils/pagination.js";

export const getAllCategories = expressAsyncHandler(async (req, res) => {
  const { results, pagination } = await paginateResults(CategoryModel, req, {
    sort: req.query.sort || "-createdAt", // Sort by creation date in descending order
    select: req.query.fields || "",
  });

  console.log("Categories ARE : ", results);
  res.status(200).json({
    success: true,
    pagination,
    results,
  });
});

export const getSingleCategory = expressAsyncHandler(async (req, res) => {
  const category = await CategoryModel.findById(req.params.id);

  console.log("Single Category is : ", category);

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "category not found" });
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

export const updateCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await CategoryModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "category not found" });
  }

  return res.status(200).json({
    status: 200,
    message: "Success Update",
    category,
  });
});

export const deleteCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await CategoryModel.findByIdAndDelete(id);

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "category not found" });
  }

  return res.status(204).json({
    status: 204,
    message: "Success Deleted",
  });
});
