import CategoryModel from "../models/category.model.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    console.log("Categories ARE : ", categories);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const getSingleCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);

    console.log("Single Category is : ", category);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Invalid category ID", error });
  }
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  console.log("req.body IS : ", req.body);

  try {
    const category = new CategoryModel({
      name,
    });

    await category.save();
    return res.status(201).json({
      status: 201,
      message: "Success",
      category,
    });
  } catch (err) {
    console.error("Error :", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      err,
    });
  }
};
