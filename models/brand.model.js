import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "Too short name"],
      maxlength: [32, "Too long name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true } 
);

const BrandModel = mongoose.model("Brand", brandSchema);

export default BrandModel;
