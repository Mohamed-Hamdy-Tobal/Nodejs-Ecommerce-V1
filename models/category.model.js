import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short name"],
      maxlength: [32, "Too long name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true } // created_at, updated_at
);

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
