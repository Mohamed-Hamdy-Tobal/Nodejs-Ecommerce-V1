# 📡 API Endpoints Documentation

---

## 🔹 Category Endpoints

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| GET    | `/api/v1/category`     | Get all categories        |
| POST   | `/api/v1/category`     | Create a new category     |
| GET    | `/api/v1/category/:id` | Get single category by ID |
| PUT    | `/api/v1/category/:id` | Update category by ID     |
| DELETE | `/api/v1/category/:id` | Delete category by ID     |

---

## 🔹 SubCategory Endpoints (Nested under Category)

> These endpoints are accessed using a `categoryId` in the route.

| Method | Endpoint                                    | Description                                        |
| ------ | ------------------------------------------- | -------------------------------------------------- |
| GET    | `/api/v1/category/:categoryId/sub-category` | Get all subcategories for a category               |
| GET    | `/api/v1/sub-category`                      | Get all subcategories                              |
| POST   | `/api/v1/sub-category`                      | Create a new subcategory under a specific category |
| GET    | `/api/v1/sub-category/:id`                  | Get single subcategory by ID                       |
| PUT    | `/api/v1/sub-category/:id`                  | Update subcategory by ID                           |
| DELETE | `/api/v1/sub-category/:id`                  | Delete subcategory by ID                           |

---

> ⚠️ Ensure that `:categoryId` is passed when working with sub-categories to relate them properly to their parent category.

---

## 📌 Notes

- All POST and PUT routes validate input using custom middleware.
- Routes like `/api/v1/category/:categoryId/sub-category` use `mergeParams: true` to access parent route params (i.e. `categoryId`) inside the `subCategoryRouter`.
