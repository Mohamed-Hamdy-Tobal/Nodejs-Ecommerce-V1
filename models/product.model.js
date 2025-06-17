import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      unique: [true, "Product must be unique"],
      minlength: [3, "Too short title"],
      maxlength: [100, "Too long title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be above 0"],
      trim: true,
      validate: {
        validator: function (value) {
          return value.toString().length <= 32;
        },
        message: "Price is too long (max 32 digits)",
      },
    },
    price_after_discount: {
      type: Number,
      default: 0,
      validate: [
        {
          validator: function (value) {
            return value < this.price;
          },
          message: "Discounted price must be less than original price",
        },
        {
          validator: function (value) {
            return value.toString().length <= 32;
          },
          message: "Discounted price is too long (max 32 digits)",
        },
      ],
    },
    colors: {
      type: [String],
      default: [],
    },
    image: {
      type: [String],
      default: [],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Quantity must be above 0"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Product brand is required"],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating must be above 1"],
      max: [5, "Rating must be below 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
