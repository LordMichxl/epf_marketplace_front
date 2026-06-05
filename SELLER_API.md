# 📦 API Documentation - Seller Endpoints

## Overview
Complete API endpoints for seller product management in the EPF Marketplace platform.

---

## Authentication
All endpoints require authentication via Bearer token in the `Authorization` header:
```
Authorization: Bearer {token}
```

---

## Endpoints

### 1️⃣ GET - Get My Products
**Route:** `GET /api/products/my-products`

**Middleware/Rules:** None (authenticated users only)

**Description:** Retrieve all products created by the authenticated seller

**Query Parameters:**
| Parameter | Type | Optional | Description |
|-----------|------|----------|-------------|
| `status` | string | Yes | Filter by status: `draft`, `published`, `sold` |

**Example Request:**
```bash
GET /api/products/my-products?status=published
Authorization: Bearer {token}
```

**Success Response (200):**
```json
[
  {
    "id": "prod_123",
    "name": "iPhone 13 Pro",
    "description": "Latest Apple smartphone",
    "price": 999,
    "quantity": 5,
    "category": "electronics",
    "status": "published",
    "imageUrl": "https://...",
    "flashPromoPrice": 899,
    "flashPromoEndDate": "2026-06-15T23:59:59Z",
    "createdAt": "2026-05-20T10:30:00Z",
    "updatedAt": "2026-05-28T14:20:00Z"
  },
  ...
]
```

---

### 2️⃣ POST - Create Product
**Route:** `POST /api/products`

**Middleware/Rules:** `seller` (user must have seller role)

**Description:** Create a new product with image and optional flash promotion

**Request Body:**
```json
{
  "name": "iPhone 13 Pro",
  "description": "Latest Apple smartphone with advanced features",
  "price": 999,
  "quantity": 5,
  "category": "electronics",
  "status": "draft",
  "image": <File>,
  "flashPromoPrice": 899,
  "flashPromoEndDate": "2026-06-15T23:59:59Z"
}
```

**Form Data Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Product name (min: 3 chars) |
| `description` | string | Yes | Product description (min: 10 chars) |
| `price` | number | Yes | Base price (€) |
| `quantity` | number | Yes | Stock quantity |
| `category` | string | Yes | Product category |
| `status` | string | Yes | `draft` or `published` |
| `image` | file | Yes | Product image (jpg, png, webp) |
| `flashPromoPrice` | number | No | Flash promo price (€) |
| `flashPromoEndDate` | datetime | No | When promo ends |

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer {token}" \
  -F "name=iPhone 13 Pro" \
  -F "description=Latest Apple smartphone" \
  -F "price=999" \
  -F "quantity=5" \
  -F "category=electronics" \
  -F "status=published" \
  -F "image=@/path/to/image.jpg" \
  -F "flashPromoPrice=899" \
  -F "flashPromoEndDate=2026-06-15T23:59:59Z"
```

**Success Response (201):**
```json
{
  "id": "prod_123",
  "name": "iPhone 13 Pro",
  "description": "Latest Apple smartphone",
  "price": 999,
  "quantity": 5,
  "category": "electronics",
  "status": "published",
  "imageUrl": "https://...",
  "flashPromoPrice": 899,
  "flashPromoEndDate": "2026-06-15T23:59:59Z",
  "createdAt": "2026-05-28T10:30:00Z",
  "updatedAt": "2026-05-28T10:30:00Z"
}
```

---

### 3️⃣ PUT - Update Product
**Route:** `PUT /api/products/{product}`

**Middleware/Rules:** `propriétaire` (must be the product owner)

**Description:** Update product details, image, and promo settings

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `product` | string | Product ID |

**Request Body:**
```json
{
  "name": "iPhone 13 Pro Max",
  "description": "Updated description",
  "price": 1099,
  "quantity": 3,
  "category": "electronics",
  "status": "published",
  "image": <File>,
  "flashPromoPrice": 999,
  "flashPromoEndDate": "2026-06-15T23:59:59Z"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:8000/api/products/prod_123 \
  -H "Authorization: Bearer {token}" \
  -F "name=iPhone 13 Pro Max" \
  -F "price=1099" \
  -F "quantity=3"
```

**Success Response (200):**
```json
{
  "id": "prod_123",
  "name": "iPhone 13 Pro Max",
  "price": 1099,
  "quantity": 3,
  "status": "published",
  ...
}
```

**Error Response (403):**
```json
{
  "message": "You are not the owner of this product"
}
```

---

### 4️⃣ DELETE - Delete Product
**Route:** `DELETE /api/products/{product}`

**Middleware/Rules:** `propriétaire` (must be the product owner)

**Description:** Delete a product (image and files are automatically cleaned up)

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `product` | string | Product ID |

**Example Request:**
```bash
curl -X DELETE http://localhost:8000/api/products/prod_123 \
  -H "Authorization: Bearer {token}"
```

**Success Response (204):**
No content returned

**Error Response (403):**
```json
{
  "message": "You are not the owner of this product"
}
```

**Error Response (404):**
```json
{
  "message": "Product not found"
}
```

---

### 5️⃣ GET - Check if Product is Favorite
**Route:** `GET /api/products/{product}/is-favorite`

**Middleware/Rules:** None (authenticated users only)

**Description:** Check if the current user has marked this product as favorite

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `product` | string | Product ID |

**Example Request:**
```bash
curl -X GET http://localhost:8000/api/products/prod_123/is-favorite \
  -H "Authorization: Bearer {token}"
```

**Success Response (200):**
```json
{
  "is_favorite": true
}
```

or

```json
{
  "is_favorite": false
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "message": "Validation error",
  "errors": {
    "name": ["The name field is required"],
    "price": ["The price must be a number"]
  }
}
```

### 401 - Unauthorized
```json
{
  "message": "Unauthenticated"
}
```

### 403 - Forbidden
```json
{
  "message": "You are not authorized to perform this action"
}
```

### 404 - Not Found
```json
{
  "message": "Resource not found"
}
```

### 422 - Unprocessable Entity
```json
{
  "message": "Validation failed",
  "errors": {
    "image": ["The image must be a valid image file"]
  }
}
```

### 500 - Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Product Statuses

| Status | Description |
|--------|-------------|
| `draft` | Product is saved but not visible to buyers |
| `published` | Product is visible and available for purchase |
| `sold` | All units are sold |

---

## Flash Promotion Rules

- **Optional:** Flash promotions are entirely optional
- **Price:** Flash promo price should be lower than the base price
- **Duration:** Automatically expires at the specified `flashPromoEndDate`
- **Display:** On product pages, the lower of the two prices is displayed with a "Flash Sale" badge

---

## File Upload Constraints

| Constraint | Value |
|-----------|-------|
| Max Image Size | 5 MB |
| Allowed Formats | JPG, PNG, WebP |
| Min Dimensions | 200×200 px |
| Recommended | 800×600 px or larger |

---

## Rate Limiting

- **Authenticated Users:** 100 requests per minute
- **File Upload:** Max 10 uploads per minute per user

---

## Example Integration (Frontend)

See implementation in:
- **Service:** `src/services/productService.js`
- **Hook:** `src/hooks/useSeller.js`
- **Component:** `src/components/ProductForm.jsx`
- **Page:** `src/pages/seller/MyProductsPage.jsx`
