# Password Reset Flow Documentation

## Overview
This document describes the complete password reset functionality implemented in the authentication system using a three-step process.

## Flow Description

### 1. Forget Password Request
- **Endpoint**: `POST /auth/forget-password`
- **Purpose**: Initiates password reset process by generating and sending OTP
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Process**:
  1. Validates email format
  2. Checks if user exists
  3. Generates 6-digit random OTP
  4. Hashes OTP using Node.js built-in crypto module (SHA-256)
  5. Saves hashed OTP to `user.passwordResetCode`
  6. Sets expiration time to 10 minutes from now in `user.passwordResetExpires`
  7. Returns success message with OTP (only in development mode)

### 2. Verify OTP
- **Endpoint**: `POST /auth/verify-otp`
- **Purpose**: Verifies the OTP before allowing password reset
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```
- **Process**:
  1. Validates email and OTP format
  2. Checks if user exists
  3. Verifies OTP hasn't expired
  4. Compares provided OTP with stored hashed OTP
  5. Returns success if OTP is valid

### 3. Reset Password
- **Endpoint**: `POST /auth/reset-password`
- **Purpose**: Sets new password after OTP verification
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "password": "newSecurePassword123",
    "confirmPassword": "newSecurePassword123"
  }
  ```
- **Process**:
  1. Validates all required fields
  2. Ensures password and confirmPassword match
  3. Checks if user exists
  4. Verifies OTP hasn't expired
  5. Compares provided OTP with stored hashed OTP
  6. Hashes new password using bcrypt
  7. Updates user password
  8. Clears reset fields (`passwordResetCode`, `passwordResetExpires`)
  9. Updates `passwordChangedAt` timestamp

## Security Features

### OTP Generation
- 6-digit random number (100000-999999)
- Converted to string before hashing
- Uses cryptographically secure random generation

### OTP Storage
- OTP is hashed using Node.js built-in crypto module (SHA-256)
- Stored in `passwordResetCode` field
- More efficient than bcrypt for OTP hashing

### Expiration Handling
- OTP expires after 10 minutes
- Automatic cleanup of expired OTPs
- Prevents replay attacks

### Password Security
- New password must be at least 6 characters
- Password confirmation required
- Password is hashed using bcrypt (salt rounds: 12)
- `passwordChangedAt` is updated to invalidate existing tokens

## Database Schema Updates

The user model includes these fields for password reset:
```javascript
{
  passwordResetCode: String,        // SHA-256 hashed OTP
  passwordResetExpires: Date,       // OTP expiration time
  passwordChangedAt: Date           // Last password change timestamp
}
```

## API Response Examples

### Forget Password Success
```json
{
  "status": 200,
  "message": "Password reset OTP sent successfully",
  "otp": "123456"  // Only in development mode
}
```

### Verify OTP Success
```json
{
  "status": 200,
  "message": "OTP verified successfully"
}
```

### Reset Password Success
```json
{
  "status": 200,
  "message": "Password reset successfully"
}
```

### Error Responses
```json
{
  "status": 400,
  "message": "OTP has expired. Please request a new one"
}
```

## Validation Rules

### Forget Password
- Email must be provided and valid format
- User must exist in system

### Verify OTP
- Email must be provided and valid format
- OTP must be exactly 6 digits, numeric only
- All fields are required

### Reset Password
- Email must be provided and valid format
- OTP must be exactly 6 digits, numeric only
- Password must be at least 6 characters
- Confirm password must match password
- All fields are required

## Production Considerations

1. **Email Service**: Implement actual email sending service (currently logs OTP)
2. **OTP Exposure**: Remove OTP from response in production
3. **Rate Limiting**: Consider adding rate limiting for OTP requests
4. **Audit Logging**: Log password reset attempts for security monitoring
5. **Environment Variables**: Use `NODE_ENV` to control OTP exposure

## Testing

### Development Mode
- OTP is returned in response for testing
- Console logs OTP for debugging

### Production Mode
- OTP is not returned in response
- Only success/error messages are sent

## Error Handling

The system handles various error scenarios:
- Invalid email format
- User not found
- OTP expiration
- Invalid OTP
- Missing required fields
- Password confirmation mismatch
- Password length validation
- Database operation failures

## Why Three-Step Process?

1. **Security**: OTP verification step adds extra security layer
2. **User Experience**: Users can verify OTP before entering new password
3. **Validation**: Separate validation for each step
4. **Flexibility**: Frontend can handle each step independently
5. **Audit Trail**: Better tracking of password reset process
