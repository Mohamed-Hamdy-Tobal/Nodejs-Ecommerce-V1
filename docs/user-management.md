# 👤 User Management System Documentation

## Overview
This document describes the complete user management functionality implemented in the system, including both authenticated user routes and admin user management routes.

## 🔐 Authenticated User Routes

These routes allow authenticated users to manage their own data using their authentication token.

### 1. Get Current User Data
- **Endpoint**: `GET /api/v1/users/me`
- **Purpose**: Retrieve current user's profile information
- **Auth Required**: Valid authentication token
- **Response**:
  ```json
  {
    "status": 200,
    "message": "User data retrieved successfully",
    "user": {
      "id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com",
      "slug": "john-doe",
      "phone": "+1234567890",
      "profileImg": "profile.jpg",
      "role": "user",
      "active": true,
      "wishlist": [],
      "address": "123 Main St",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### 2. Update Current User Data
- **Endpoint**: `PUT /api/v1/users/me`
- **Purpose**: Update current user's profile information
- **Auth Required**: Valid authentication token
- **Request Body**:
  ```json
  {
    "name": "John Smith",
    "phone": "+1987654321",
    "profileImg": "new-profile.jpg",
    "address": "456 Oak Ave"
  }
  ```
- **Validation Rules**:
  - `name`: Optional, 3-32 characters
  - `phone`: Optional, valid mobile phone format
  - `profileImg`: Optional, string
  - `address`: Optional, string
- **Response**:
  ```json
  {
    "status": 200,
    "message": "User updated successfully",
    "user": {
      // Updated user object (password fields excluded)
    }
  }
  ```

### 3. Change Current User Password
- **Endpoint**: `PUT /api/v1/users/me/change-password`
- **Purpose**: Change current user's password
- **Auth Required**: Valid authentication token
- **Request Body**:
  ```json
  {
    "currentPassword": "oldPassword123",
    "newPassword": "newSecurePassword123",
    "confirmPassword": "newSecurePassword123"
  }
  ```
- **Validation Rules**:
  - `currentPassword`: Required
  - `newPassword`: Required, minimum 6 characters
  - `confirmPassword`: Required, must match newPassword
- **Security Features**:
  - Verifies current password before allowing change
  - Hashes new password with bcrypt (12 salt rounds)
  - Clears refresh token for security
  - Updates `passwordChangedAt` timestamp
- **Response**:
  ```json
  {
    "status": 200,
    "message": "Password changed successfully"
  }
  ```

## 👑 Admin User Management Routes

These routes allow administrators to manage all users in the system.

### 1. Get All Users
- **Endpoint**: `GET /api/v1/users`
- **Purpose**: Retrieve all users with filtering, sorting, and pagination
- **Auth Required**: Admin authentication token
- **Query Parameters**:
  - `page`: Page number for pagination
  - `limit`: Number of results per page
  - `sort`: Sort fields (e.g., `-createdAt,name`)
  - `fields`: Select specific fields
  - `search`: Search in name and email
  - `role`: Filter by role (user/admin)
  - `active`: Filter by active status

### 2. Get Single User
- **Endpoint**: `GET /api/v1/users/:id`
- **Purpose**: Retrieve specific user by ID
- **Auth Required**: Admin authentication token
- **URL Parameters**:
  - `id`: User's MongoDB ObjectId
- **Validation**: MongoDB ObjectId format validation

### 3. Create User
- **Endpoint**: `POST /api/v1/users`
- **Purpose**: Create a new user account
- **Auth Required**: Admin authentication token
- **Request Body**: Full user creation data
- **Validation**: Comprehensive user data validation

### 4. Update User
- **Endpoint**: `PUT /api/v1/users/:id`
- **Purpose**: Update specific user's information
- **Auth Required**: Admin authentication token
- **URL Parameters**:
  - `id`: User's MongoDB ObjectId
- **Request Body**: User update data
- **Validation**: User data validation with duplicate checking

### 5. Change User Password
- **Endpoint**: `PUT /api/v1/users/:id/change-password`
- **Purpose**: Change specific user's password
- **Auth Required**: Admin authentication token
- **URL Parameters**:
  - `id`: User's MongoDB ObjectId
- **Request Body**: Password change data
- **Validation**: Password validation rules

### 6. Delete User
- **Endpoint**: `DELETE /api/v1/users/:id`
- **Purpose**: Delete specific user account
- **Auth Required**: Admin authentication token
- **URL Parameters**:
  - `id`: User's MongoDB ObjectId
- **Validation**: MongoDB ObjectId format validation

## 🔒 Security Features

### Authentication & Authorization
- **Token-based authentication** using JWT
- **Role-based access control** (user vs admin)
- **Middleware protection** for all routes
- **Token expiration** and refresh mechanisms

### Data Protection
- **Password hashing** using bcrypt (12 salt rounds)
- **Sensitive field exclusion** from responses
- **Input validation** and sanitization
- **Duplicate data prevention** (email, phone)

### Password Security
- **Current password verification** before changes
- **Password strength requirements** (minimum 6 characters)
- **Password confirmation** validation
- **Automatic token invalidation** after password changes

## 📊 Response Format

All endpoints follow a consistent response format:

### Success Response
```json
{
  "status": 200,
  "message": "Operation successful message",
  "data": {} // Optional data field
}
```

### Error Response
```json
{
  "status": 400,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## 🧪 Testing Examples

### Get Current User
```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update User Profile
```bash
curl -X PUT http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name",
    "phone": "+1234567890"
  }'
```

### Change Password
```bash
curl -X PUT http://localhost:3000/api/v1/users/me/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword123",
    "confirmPassword": "newPassword123"
  }'
```

## 🚨 Production Considerations

1. **Rate Limiting**: Implement rate limiting for sensitive operations
2. **Audit Logging**: Log all user management operations
3. **Input Sanitization**: Ensure all inputs are properly sanitized
4. **Error Handling**: Implement comprehensive error handling
5. **Monitoring**: Set up monitoring for failed authentication attempts
6. **Backup**: Regular backup of user data
7. **Compliance**: Ensure compliance with data protection regulations

## 🔍 Error Handling

The system handles various error scenarios:
- **Authentication failures**: Invalid or expired tokens
- **Authorization failures**: Insufficient privileges
- **Validation errors**: Invalid input data
- **Database errors**: Connection or query failures
- **Duplicate data**: Email or phone already exists
- **Resource not found**: User ID doesn't exist

## 📚 Related Documentation

- [Authentication System](./password-reset.md)
- [API Endpoints](./endpoints.md)
- [Error Handling](./error-handlers.md)
- [Validation Rules](./validation.md)
