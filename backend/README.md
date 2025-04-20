# Qart API Documentation

Base URL: http://localhost:5000/api

## Authentication

### Register
POST /auth/register
Request Body:
{
  "email": "string",
  "password": "string",
  "firstname": "string",
  "lastname": "string"
}
Response: 201 Created
{
  User object without password
}

### Login
POST /auth/login
Request Body:
{
  "email": "string",
  "password": "string"
}
Response: 200 OK
{
  "token": "JWT token",
  "user": {User object without password}
}

## Users

### Get Profile
GET /users/me
Headers:
- Authorization: Bearer {token}
Response: 200 OK
{
  User profile without password
}

### Update Profile
PUT /users/me
Headers:
- Authorization: Bearer {token}
Request Body:
{
  "firstname": "string (optional)",
  "lastname": "string (optional)",
  "email": "string (optional)"
}
Response: 200 OK
{
  Updated user profile
}

### Update Avatar
PUT /users/me/avatar
Headers:
- Authorization: Bearer {token}
Request Body (multipart/form-data):
- avatar: File
Response: 200 OK
{
  Updated user profile with new avatar path
}

### Follow User
POST /users/:id/follow
Headers:
- Authorization: Bearer {token}
Response: 200 OK
{
  Updated target user profile
}

### Unfollow User
POST /users/:id/unfollow
Headers:
- Authorization: Bearer {token}
Response: 200 OK
{
  Updated target user profile
}

## Qarts (Posts)

### Get All Qarts
GET /qarts
Headers:
- Authorization: Bearer {token}
Response: 200 OK
[
  {
    Array of qart objects with populated user and comments
  }
]

### Get Qart by ID
GET /qarts/:id
Headers:
- Authorization: Bearer {token}
Response: 200 OK
{
  Qart object with populated user and comments
}

### Get Qarts by User ID
GET /qarts/user/:userId
Headers:
- Authorization: Bearer {token}
Response: 200 OK
[
  {
    Array of qart objects for specific user
  }
]

### Get Liked Qarts
GET /qarts/liked
Headers:
- Authorization: Bearer {token}
Response: 200 OK
[
  {
    Array of qart objects liked by the authenticated user
  }
]

### Create Qart
POST /qarts
Headers:
- Authorization: Bearer {token}
Request Body (multipart/form-data):
- content: string
- image: File (optional)
Response: 201 Created
{
  Created qart object
}

### Delete Qart
DELETE /qarts/:id
Headers:
- Authorization: Bearer {token}
Response: 200 OK
{
  "message": "Deleted"
}

### Like Qart
POST /qarts/:id/like
Headers:
- Authorization: Bearer {token}
Response: 200 OK
{
  Updated qart object with new like
}

### Unlike Qart
POST /qarts/:id/unlike
Headers:
- Authorization: Bearer {token}
Response: 200 OK
{
  Updated qart object with like removed
}

## Comments

### Get Comments by Qart
GET /comments/qart/:qartId
Headers:
- Authorization: Bearer {token}
Response: 200 OK
[
  {
    Array of comment objects with populated user
  }
]

### Add Comment
POST /comments
Headers:
- Authorization: Bearer {token}
Request Body:
{
  "text": "string",
  "qartId": "string"
}
Response: 201 Created
{
  Created comment object
}

### Delete Comment
DELETE /comments/:id
Headers:
- Authorization: Bearer {token}
Response: 200 OK
{
  "message": "Deleted"
}

## Error Responses

All endpoints may return the following error responses:

400 Bad Request
{
  "error": "Error message describing the issue"
}

401 Unauthorized
{
  "error": "No token" or "Invalid token"
}

404 Not Found
{
  "error": "Resource not found message"
}

## Notes

1. All protected routes require a valid JWT token in the Authorization header
2. Dates are returned in ISO 8601 format
3. File uploads support images (JPEG, PNG, etc.)
4. Users can only delete their own qarts and comments
5. The token expires in 7 days from issuance