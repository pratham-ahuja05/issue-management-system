# Role-Based Authentication System Documentation

## Overview
This document describes the role-based authentication and authorization system implemented in the Issue Management System.

## Architecture

### Authentication Flow
1. User registers via `/auth/register` endpoint
2. User logs in via `/auth/login` endpoint with username and password
3. Server validates credentials and returns JWT token
4. Client includes JWT in `Authorization: Bearer <token>` header for subsequent requests
5. Server validates JWT and extracts user information
6. Request is processed based on user's roles

### Authorization Model
Four roles are available in the system:

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access - can create, read, update, delete issues and users |
| **MANAGER** | Can create, read, update issues; manage team activities |
| **ANALYST** | Can create, read, update issues; analyze issue data |
| **VIEWER** | Read-only access to issues; view analytics |

## API Endpoints

### Authentication Endpoints

#### 1. Register User
```
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "username": "john_doe",
  "email": "john@example.com",
  "roles": ["VIEWER"]
}
```

#### 2. Login User
```
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "username": "john_doe",
  "email": "john@example.com",
  "roles": ["VIEWER"]
}
```

#### 3. Get Current User Profile
```
GET /users/me
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "enabled": true,
  "roles": ["VIEWER"]
}
```

### Issue Management Endpoints (with role-based access)

#### 1. Create Issue (ANALYST, MANAGER, ADMIN)
```
POST /issues
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Issue Title",
  "description": "Issue Description"
}
```

#### 2. Get All Issues (VIEWER, ANALYST, MANAGER, ADMIN)
```
GET /issues?page=0&size=5&sortBy=id&direction=asc
Authorization: Bearer <token>
```

#### 3. Get Issue by ID (VIEWER, ANALYST, MANAGER, ADMIN)
```
GET /issues/{id}
Authorization: Bearer <token>
```

#### 4. Update Issue (ANALYST, MANAGER, ADMIN)
```
PUT /issues/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description",
  "status": "IN_PROGRESS"
}
```

#### 5. Delete Issue (ADMIN only)
```
DELETE /issues/{id}
Authorization: Bearer <token>
```

#### 6. Restore Issue (ADMIN only)
```
PUT /issues/{id}/restore
Authorization: Bearer <token>
```

#### 7. Mark as Duplicate (ANALYST, MANAGER, ADMIN)
```
POST /issues/{id}/mark-duplicate
Authorization: Bearer <token>
Content-Type: application/json

{
  "duplicateId": 5
}
```

#### 8. Search Issues (VIEWER, ANALYST, MANAGER, ADMIN)
```
GET /issues/search?query=bug&page=0&size=5
Authorization: Bearer <token>
```

## Database Schema

### Tables Created

#### 1. users
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. roles
```sql
CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL
);
```

#### 3. user_roles (Junction Table)
```sql
CREATE TABLE user_roles (
  user_id BIGINT,
  role_id BIGINT,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

## Configuration

### application.properties
```properties
# JWT Configuration
jwt.secret=${JWT_SECRET:mySecretKeyForJWTTokenGenerationAndValidationPurpose12345}
jwt.expiration=${JWT_EXPIRATION:86400000}  # 24 hours in milliseconds

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/issue_db
spring.datasource.username=root
spring.datasource.password=your_password
```

## Security Features

### 1. Password Encryption
- Passwords are encrypted using BCrypt algorithm
- Each password is salted before encryption
- Original passwords are never stored

### 2. JWT Token
- Tokens are signed with HMAC-SHA512
- Tokens expire after 24 hours (configurable)
- Tokens contain username as the subject
- Invalid or expired tokens are rejected

### 3. CORS Configuration
- CORS is enabled for all origins
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Authorization header is exposed

### 4. Role-Based Access Control
- `@PreAuthorize` annotations enforce role checks
- Access denied returns 403 Forbidden
- Authentication failed returns 401 Unauthorized

## Key Classes

### Models
- **User.java** - User entity with roles
- **Role.java** - Role entity
- **RoleType.java** - Enum for role types

### DTOs
- **LoginRequest.java** - Login request payload
- **LoginResponse.java** - Login response with token
- **RegisterRequest.java** - Registration request
- **UserResponse.java** - User profile response

### Services
- **AuthService.java** - Authentication and registration logic
- **CustomUserDetailsService.java** - Load user details for Spring Security

### Controllers
- **AuthController.java** - Login and registration endpoints
- **UserController.java** - User profile endpoint
- **IssueController.java** - Issue management with role checks

### Utilities
- **JwtTokenProvider.java** - JWT token generation and validation
- **CustomUserDetails.java** - Custom UserDetails implementation
- **JwtAuthenticationFilter.java** - JWT filter for request authentication

### Configuration
- **SecurityConfig.java** - Spring Security configuration
- **DataInitializationConfig.java** - Initialize default roles on startup

## Testing the System

### 1. Register a New User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 3. Use Token to Access Protected Resource
```bash
curl -X GET http://localhost:8080/users/me \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Error Handling

### Authentication Error (401)
```json
{
  "timestamp": "2024-07-25T20:00:00",
  "status": 401,
  "error": "Authentication Failed",
  "message": "Bad credentials",
  "path": "/auth/login"
}
```

### Authorization Error (403)
```json
{
  "timestamp": "2024-07-25T20:00:00",
  "status": 403,
  "error": "Access Denied",
  "message": "You do not have permission to access this resource",
  "path": "/issues/1"
}
```

## Next Steps

1. Deploy the application to a server
2. Update JWT_SECRET with a strong, random key
3. Configure database with proper credentials
4. Set up HTTPS for secure token transmission
5. Implement rate limiting for login attempts
6. Add user management endpoints for admins
7. Implement refresh token mechanism
8. Add audit logging for security events

## Security Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Store sensitive credentials in environment variables
3. ✅ Use strong JWT secret (minimum 32 characters)
4. ✅ Implement token refresh mechanism
5. ✅ Add rate limiting on auth endpoints
6. ✅ Log authentication failures
7. ✅ Implement CSRF protection if using cookies
8. ✅ Regularly update Spring Security and JWT libraries
