# Models Documentation

## 🔹 Brand

- `name`: String - required, unique
- `slug`: String - auto-generated from name
- `image`: String (image path or URL)

---

## 🔹 Category (Main Category)

- `name`: String - required, unique
- `slug`: String - auto-generated
- `image`: String

---

## 🔹 SubCategory

- `name`: String - required
- `slug`: String - auto-generated
- `image`: String
- `category`: ObjectId - Reference to Main Category - required

---

## 🔹 Product

| Field                  | Type       | Description                                           |
| ---------------------- | ---------- | ----------------------------------------------------- |
| `title`                | `String`   | **Required**. Must be unique, between 3–32 characters |
| `slug`                 | `String`   | Auto-generated from title, stored in lowercase        |
| `description`          | `String`   | **Required**. Minimum 20 characters                   |
| `price`                | `Number`   | **Required**. Must be greater than 0                  |
| `price_after_discount` | `Number`   | Must be less than original price, default: `0`        |
| `colors`               | `[String]` | Optional. Product available colors                    |
| `image`                | `[String]` | Array of image URLs, default: empty array             |
| `quantity`             | `Number`   | **Required**. Must be >= 0                            |
| `sold`                 | `Number`   | Number of items sold, default: `0`                    |
| `category`             | `ObjectId` | **Required**. Reference to `Category` model           |
| `subCategory`          | `ObjectId` | Optional. Reference to `SubCategory` model            |
| `brand`                | `ObjectId` | **Required**. Reference to `Brand` model              |
| `ratings`              | `Number`   | Average rating (1 to 5), default: `0`                 |
| `totalRating`          | `Number`   | Total number of ratings received, default: `0`        |
| `isActive`             | `Boolean`  | If product is published, default: `false`             |
| `createdAt`            | `Date`     | Auto-generated timestamp                              |
| `updatedAt`            | `Date`     | Auto-updated timestamp                                |
