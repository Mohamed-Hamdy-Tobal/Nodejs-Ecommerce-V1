# 🛍️ E-Commerce API

This is a fully-featured RESTful API for managing categories, sub-categories, brands, and products in an e-commerce system. It supports advanced filtering, pagination, sorting, and search capabilities.

---

## 📦 Technologies Used

- Node.js & Express
- MongoDB & Mongoose
- `express-async-handler`
- `slugify`
- Custom filtering & pagination logic

---

## 📡 API Endpoints Documentation

---

### 🔹 Category Endpoints

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| GET    | `/api/v1/category`     | Get all categories        |
| POST   | `/api/v1/category`     | Create a new category     |
| GET    | `/api/v1/category/:id` | Get single category by ID |
| PUT    | `/api/v1/category/:id` | Update category by ID     |
| DELETE | `/api/v1/category/:id` | Delete category by ID     |

---

### 🔹 SubCategory Endpoints (Nested under Category)

> These endpoints are accessed using a `categoryId` in the route.

| Method | Endpoint                                    | Description                                        |
| ------ | ------------------------------------------- | -------------------------------------------------- |
| GET    | `/api/v1/category/:categoryId/sub-category` | Get all subcategories for a category               |
| GET    | `/api/v1/sub-category`                      | Get all subcategories                              |
| POST   | `/api/v1/sub-category`                      | Create a new subcategory under a specific category |
| GET    | `/api/v1/sub-category/:id`                  | Get single subcategory by ID                       |
| PUT    | `/api/v1/sub-category/:id`                  | Update subcategory by ID                           |
| DELETE | `/api/v1/sub-category/:id`                  | Delete subcategory by ID                           |

> ⚠️ Ensure that `:categoryId` is passed when working with sub-categories to relate them properly to their parent category.

---

### 🔹 Brand Endpoints

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/api/v1/brand`      | Get all brands           |
| POST   | `/api/v1/brand`      | Create a new brand       |
| GET    | `/api/v1/brand/:id`  | Get single brand by ID   |
| PUT    | `/api/v1/brand/:id`  | Update brand by ID       |
| DELETE | `/api/v1/brand/:id`  | Delete brand by ID       |

> ✅ Supports filtering, sorting, field selection, and pagination using query params.

---

### 🔹 Product Endpoints

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/v1/product`      | Get all products         |
| POST   | `/api/v1/product`      | Create a new product     |
| GET    | `/api/v1/product/:id`  | Get single product by ID |
| PUT    | `/api/v1/product/:id`  | Update product by ID     |
| DELETE | `/api/v1/product/:id`  | Delete product by ID     |

> ✅ Fully supports advanced filtering, search, sorting, field limiting, and pagination.

#### 🔍 Supported Query Parameters

| Parameter Type     | Example                                             | Description                          |
|--------------------|-----------------------------------------------------|--------------------------------------|
| Exact match        | `?brand=Samsung`                                    | Match specific fields                |
| Array match        | `?colors=red,blue`                                  | `$in` query for multiple values      |
| Range              | `?price_gte=100&price_lte=500`                      | Filter between values                |
| Boolean            | `?isActive=true`                                    | Filter true/false fields             |
| Search             | `?search=iphone`                                    | Search in title & description        |
| Date               | `?createdAt_after=2024-01-01`                       | Filter by date range                 |
| Sorting            | `?sort=-price,rating`                               | Sort by fields (descending/ascending)|
| Field Limiting     | `?fields=title,price`                               | Only return specific fields          |
| Pagination         | `?page=2&limit=20`                                  | Paginate results                     |

---

## ⚙️ Filtering Engine

The API uses a reusable dynamic filtering system built with:

- `FilterEngine`: Transforms query params into MongoDB-compatible filters.
- `FilterFactory`: Retrieves pre-configured filters per entity from `filterConfigs`.

This setup allows fast development and clean, reusable logic across models.

---

## 🧪 Example Request

```http
GET /api/v1/product?brand=Samsung&price_gte=500&search=smartphone&sort=-price&fields=title,price
