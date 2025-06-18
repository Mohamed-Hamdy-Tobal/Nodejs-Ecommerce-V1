export const productFilters = (query) => {
  const filter = {};
  let sort = "-createdAt";

  // === Exact match for multiple IDs ===
  const idFields = ["category", "brand", "subCategories"];
  idFields.forEach((field) => {
    if (query[field]) {
      const values = query[field].split(",").map((v) => v.trim());
      // subCategories is an array in schema, others are single refs
      filter[field] = { $in: values };
    }
  });

  // === Boolean fields ===
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  // === Partial text search ===
  if (query.search) {
    const keyword = query.search.trim();
    filter.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  // === Range fields (number)
  const rangeFields = [
    "price",
    "price_after_discount",
    "ratingsAverage",
    "ratingsQuantity",
    "quantity",
    "sold",
  ];

  rangeFields.forEach((field) => {
    const exact = query[`exact_${field}`];
    const gte = query[`${field}_gte`];
    const lte = query[`${field}_lte`];

    if (exact) {
      filter[field] = Number(exact);
    } else {
      const range = {};
      if (gte) range.$gte = Number(gte);
      if (lte) range.$lte = Number(lte);
      if (Object.keys(range).length > 0) {
        filter[field] = range;
      }
    }
  });

  // === Array match fields (e.g. colors, sizes)
  const arrayFields = ["colors", "sizes"];
  arrayFields.forEach((field) => {
    if (query[field]) {
      const values = query[field].split(",").map((v) => v.trim());
      filter[field] = { $in: values };
    }
  });

  //  === Sorting Fields  ===
  if (query.sort) {
    const sortFields = query.sort
      .split(",")
      .map((field) => {
        if (field.startsWith("-")) return `-${field.slice(1).trim()}`;
        return field.trim();
      })
      .join(" ");
    sort = sortFields;
  }

  //  === Select Fields  ===
  let select = "-__v";
  if (query.fields) {
    const userFields = query.fields
      .split(",")
      .map((field) => (field.startsWith("-") ? `-${field.slice(1)}` : field))
      .join(" ");
    select = `${userFields}`; // always add -__v
  }

  return { filter, sort, select };
};
