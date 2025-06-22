# Universal Filter System 🚀

A powerful, flexible, and reusable filtering system for Node.js and MongoDB applications. Build complex queries with ease and maintain consistency across all your API endpoints.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Core Concepts](#-core-concepts)
- [Filter Types](#-filter-types)
- [Pre-configured Entities](#-pre-configured-entities)
- [Usage Examples](#-usage-examples)
- [Advanced Usage](#-advanced-usage)
- [API Reference](#-api-reference)
- [Query Parameters](#-query-parameters)
- [Best Practices](#-best-practices)
- [Contributing](#-contributing)

## ✨ Features

- **🔄 Reusable**: Works with any MongoDB model
- **🎯 Type-safe**: Automatic value conversion and validation
- **🚀 Performance**: Optimized MongoDB queries
- **🔧 Extensible**: Easy to add custom filter logic
- **📦 Pre-configured**: Ready-to-use filters for common entities
- **🔍 Powerful Search**: Full-text search across multiple fields
- **📊 Advanced Filtering**: Range, array, boolean, and date filters
- **📱 Consistent API**: Same query patterns across all endpoints

## 🚀 Installation

```bash
# Copy the filter system files to your project
mkdir -p utils/filters
# Copy filterEngine.js, filterConfigs.js, and filterFactory.js
```

## ⚡ Quick Start

### 1. Basic Usage

```javascript
import { FilterFactory } from "../utils/filters/filterFactory.js";

// Get a pre-configured filter
const productFilter = FilterFactory.getFilter("products");

export const getAllProducts = async (req, res) => {
  const { filter, sort, select } = productFilter(req.query);

  const products = await ProductModel.find(filter).sort(sort).select(select);

  res.json({ products });
};
```

### 2. With Pagination

```javascript
export const getAllProducts = async (req, res) => {
  const { filter, sort, select } = productFilter(req.query);

  const { results, pagination } = await paginateResults(ProductModel, req, {
    filter,
    sort,
    select,
    populate: [
      { path: "category", select: "name -_id" },
      { path: "brand", select: "name -_id" },
    ],
  });

  res.json({ success: true, pagination, results });
};
```

## 🧠 Core Concepts

### FilterEngine

The core engine that processes query parameters and converts them into MongoDB filters.

### FilterFactory

A factory class that creates and manages filter instances for different entity types.

### Filter Configuration

Each entity type has a configuration object that defines what fields can be filtered and how.

## 🔍 Filter Types

### 1. Exact Match Filters

Perfect for IDs, categories, status fields, etc.

```javascript
// Configuration
exactMatch: ['category', 'brand', 'status']

// Query Examples
?category=electronics
?brand=apple,samsung
?status=active
```

### 2. Range Filters

For numeric fields like price, ratings, age, etc.

```javascript
// Configuration
ranges: ['price', 'rating', 'age']

// Query Examples
?price_gte=100&price_lte=500  // Between 100 and 500
?rating_gt=4                  // Greater than 4
?exact_price=299              // Exactly 299
```

### 3. Array Filters

For fields that contain arrays of values.

```javascript
// Configuration
arrays: ['tags', 'colors', 'sizes']

// Query Examples
?colors=red,blue,green
?tags=electronics,mobile
?sizes=M,L,XL
```

### 4. Boolean Filters

For true/false fields.

```javascript
// Configuration
booleans: ['isActive', 'isPublished', 'isVerified']

// Query Examples
?isActive=true
?isPublished=false
?isVerified=true
```

### 5. Search Filters

Full-text search across multiple fields.

```javascript
// Configuration
search: ['title', 'description', 'content']

// Query Examples
?search=smartphone
?search=apple iphone
```

### 6. Date Filters

For date and timestamp fields.

```javascript
// Configuration
dates: ['createdAt', 'updatedAt', 'publishedAt']

// Query Examples
?createdAt_after=2024-01-01
?updatedAt_before=2024-12-31
?exact_publishedAt=2024-06-15
```

### 7. Custom Filters

For complex, custom filtering logic.

```javascript
// Configuration
custom: [
  {
    field: 'price_range',
    handler: (value) => {
      const [min, max] = value.split('-').map(Number);
      return { price: { $gte: min, $lte: max } };
    }
  }
]

// Query Examples
?price_range=100-500
```

## 📦 Pre-configured Entities

### Products

```javascript
const productFilter = FilterFactory.getFilter("products");
```

**Supports**: category, brand, price ranges, colors, search, ratings, stock quantity

### Users

```javascript
const userFilter = FilterFactory.getFilter("users");
```

**Supports**: role, status, age ranges, email search, verification status

### Categories

```javascript
const categoryFilter = FilterFactory.getFilter("categories");
```

**Supports**: parent category, type, product count, feature status

### Orders

```javascript
const orderFilter = FilterFactory.getFilter("orders");
```

**Supports**: status, payment method, amount ranges, delivery status

### Reviews

```javascript
const reviewFilter = FilterFactory.getFilter("reviews");
```

**Supports**: rating ranges, approval status, product/user associations

## 💡 Usage Examples

### Products API

```javascript
// controllers/productController.js
import { FilterFactory } from "../utils/filters/filterFactory.js";

const productFilter = FilterFactory.getFilter("products");

export const getAllProducts = expressAsyncHandler(async (req, res) => {
  const { filter, sort, select } = productFilter(req.query);

  const { results, pagination } = await paginateResults(ProductModel, req, {
    filter,
    sort,
    select,
    populate: [
      { path: "category", select: "name -_id" },
      { path: "brand", select: "name -_id" },
      { path: "subCategories", select: "name -_id" },
    ],
  });

  res.status(200).json({
    success: true,
    pagination,
    results,
  });
});
```

### Users API

```javascript
// controllers/userController.js
const userFilter = FilterFactory.getFilter("users");

export const getAllUsers = expressAsyncHandler(async (req, res) => {
  const { filter, sort, select } = userFilter(req.query);

  const { results, pagination } = await paginateResults(UserModel, req, {
    filter,
    sort,
    select,
    populate: [{ path: "role", select: "name -_id" }],
  });

  res.status(200).json({
    success: true,
    pagination,
    results,
  });
});
```

## 🔧 Advanced Usage

### Creating Custom Filters

```javascript
// Create a custom filter configuration
const customProductFilter = FilterFactory.createFilter("products", {
  defaultSort: "price", // Override default sorting
  search: ["title"], // Only search in title
  custom: [
    {
      field: "discount_percentage",
      handler: (value) => {
        const percentage = parseInt(value);
        return {
          $expr: {
            $gte: [
              {
                $multiply: [
                  { $divide: [{ $subtract: ["$price", "$price_after_discount"] }, "$price"] },
                  100,
                ],
              },
              percentage,
            ],
          },
        };
      },
    },
  ],
});
```

### Registering New Entity Types

```javascript
// Register a new entity type
FilterFactory.registerFilter("blogs", {
  exactMatch: ["author", "category", "status"],
  arrays: ["tags", "topics"],
  ranges: ["views", "likes", "readTime"],
  booleans: ["isPublished", "isFeatured"],
  search: ["title", "content", "excerpt"],
  dates: ["createdAt", "publishedAt", "updatedAt"],
  custom: [
    {
      field: "author_name",
      handler: (value) => ({
        "author.name": { $regex: value, $options: "i" },
      }),
    },
  ],
  defaultSort: "-publishedAt",
  defaultSelect: "-__v -draft",
});

// Use the new filter
const blogFilter = FilterFactory.getFilter("blogs");
```

### Extending Existing Configurations

```javascript
// Extend an existing configuration
const extendedProductFilter = FilterFactory.createFilter("products", {
  ...FilterFactory.getConfig("products"),
  custom: [
    ...(FilterFactory.getConfig("products").custom || []),
    {
      field: "trending",
      handler: (value) => {
        if (value === "true") {
          return {
            $and: [
              { views: { $gte: 1000 } },
              { ratingsAverage: { $gte: 4 } },
              { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
            ],
          };
        }
        return {};
      },
    },
  ],
});
```

## 📚 API Reference

### FilterFactory Methods

#### `FilterFactory.getFilter(entityType)`

Returns a pre-configured filter function for the specified entity type.

```javascript
const productFilter = FilterFactory.getFilter("products");
```

#### `FilterFactory.createFilter(entityType, customConfig)`

Creates a filter function with custom configuration.

```javascript
const customFilter = FilterFactory.createFilter("products", {
  defaultSort: "price",
  search: ["title"],
});
```

#### `FilterFactory.registerFilter(entityType, config)`

Registers a new filter configuration.

```javascript
FilterFactory.registerFilter("blogs", {
  exactMatch: ["author"],
  search: ["title", "content"],
});
```

### Filter Configuration Object

```javascript
{
  exactMatch: ['field1', 'field2'],      // Fields for exact matching
  arrays: ['field3', 'field4'],          // Array fields
  ranges: ['field5', 'field6'],          // Numeric fields for range filtering
  booleans: ['field7', 'field8'],        // Boolean fields
  search: ['field9', 'field10'],         // Fields for text search
  dates: ['field11', 'field12'],         // Date fields
  custom: [                              // Custom filter handlers
    {
      field: 'custom_field',
      handler: (value, query) => ({ /* MongoDB filter */ })
    }
  ],
  defaultSort: '-createdAt',             // Default sorting
  defaultSelect: '-__v'                  // Default field selection
}
```

## 🔍 Query Parameters

### Sorting

```
?sort=price               # Sort by price ascending
?sort=-price              # Sort by price descending
?sort=price,-createdAt    # Sort by price asc, then createdAt desc
```

### Field Selection

```
?fields=title,price,image    # Only return specified fields
?fields=-description,-__v    # Exclude specified fields
```

### Range Queries

```
?price_gte=100              # Price greater than or equal to 100
?price_lte=500              # Price less than or equal to 500
?price_gt=100               # Price greater than 100
?price_lt=500               # Price less than 500
?exact_price=299            # Price exactly 299
```

### Date Queries

```
?createdAt_after=2024-01-01     # Created after date
?createdAt_before=2024-12-31    # Created before date
?exact_createdAt=2024-06-15     # Created on exact date
```

### Complex Query Examples

```bash
# Products: Electronics, Apple or Samsung brand, price 100-1000, red or blue colors
GET /api/products?category=electronics&brand=apple,samsung&price_gte=100&price_lte=1000&colors=red,blue&isActive=true&search=phone&sort=-price,ratingsAverage&fields=title,price,image

# Users: Admin role, active, age 18+, search for "john"
GET /api/users?role=admin&isActive=true&age_gte=18&search=john&sort=-createdAt&fields=name,email,role

# Orders: Pending or confirmed, paid, amount 50+, created after 2024-01-01
GET /api/orders?status=pending,confirmed&isPaid=true&totalAmount_gte=50&createdAt_after=2024-01-01&sort=-createdAt
```

**Built with ❤️**
