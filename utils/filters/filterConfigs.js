export const filterConfigs = {
  // Products Filter Configuration
  products: {
    exactMatch: ["category", "brand"],
    arrays: ["subCategories", "colors", "sizes"], // $in
    ranges: [
      "price", // price_gte=100&price_lte=500
      "price_after_discount",
      "ratingsAverage",
      "ratingsQuantity",
      "quantity",
      "sold",
    ],
    booleans: ["isActive"],
    search: ["title", "description"], // regex
    dates: ["createdAt", "updatedAt"],
    defaultSort: "-createdAt",
    defaultSelect: "-__v",
  },

  brands: {
    search: ["name"],
    dates: ["createdAt", "updatedAt"],
    defaultSort: "-createdAt",
    defaultSelect: "-__v",
  },

  // Users Filter Configuration
  users: {
    exactMatch: ["role", "status"],
    arrays: ["permissions", "interests"],
    ranges: ["age", "loginCount"],
    booleans: ["isActive", "isVerified", "isBlocked"],
    search: ["name", "email", "phone"],
    dates: ["createdAt", "lastLogin", "birthDate"],
    defaultSort: "-createdAt",
    defaultSelect: "-__v -password",
  },

  // Categories Filter Configuration
  categories: {
    search: ["name"],
    dates: ["createdAt", "updatedAt"],
    defaultSort: "-createdAt",
    defaultSelect: "-__v",
  },
  
  subCategories: {
    search: ["name"],
    dates: ["createdAt", "updatedAt"],
    defaultSort: "-createdAt",
    defaultSelect: "-__v",
  },
};
