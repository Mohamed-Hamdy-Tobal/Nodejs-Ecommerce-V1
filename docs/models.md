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

- `title`: String - required
- `slug`: String - auto-generated
- `description`: String
- `quantity`: Number
- `sold`: Number - default: 0
- `price`: Number - required
- `priceAfterDiscount`: Number
- `colors`: [String]
- `imageCover`: String
- `images`: [String]
- `category`: ObjectId - required
- `subcategories`: [ObjectId]
- `brand`: ObjectId
- `ratingsAverage`: Number - default: 0
- `ratingsQuantity`: Number - default: 0

---
