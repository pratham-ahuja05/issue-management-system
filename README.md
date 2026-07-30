# 🛡️ Sentinel-AI: Intelligent Incident Engine and Issue Tracker

> "The guardian of your production workflow." — A high-performance, secure backend that transforms raw incident logs into actionable engineering insights with **role-based authentication and AI-powered analysis**.

---

## 📖 Overview

**Sentinel-AI** is an enterprise-grade issue management and incident tracking system that bridges the gap between raw incident logs and actionable engineering insights. It doesn't just store tickets — it **analyzes, categorizes, and manages** them intelligently.

### Key Strengths:
- 🔐 **Secure & Scalable** - JWT-based authentication with role-based access control
- 🤖 **AI-Powered** - Automatic duplicate detection and intelligent summarization
- 📊 **Production-Ready** - Soft-delete support, comprehensive audit trails, and pagination
- ⚡ **High-Performance** - Optimized queries, efficient filtering, and real-time response
- 🎯 **Multi-Role System** - ADMIN, MANAGER, ANALYST, and VIEWER roles for granular access

---

## 🧠 ER Diagram

<p align="center">
  <img src="ER diagram IMS.png" width="80%"/>
</p>

---

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication & Authorization** | JWT-based login with role-based access control (ADMIN, MANAGER, ANALYST, VIEWER) |
| 🤖 **AI Duplicate Detection** | Intelligent similarity analysis to eliminate redundant incident reports |
| 📝 **Auto-Summarization** | Automatic "TL;DR" generation for long and unstructured bug reports |
| 🔄 **Issue Lifecycle Management** | Full workflow: `OPEN → IN_PROGRESS → RESOLVED → CLOSED` |
| 🗑️ **Soft-Delete with Restoration** | Safe deletion with full recovery capability for admins |
| 📑 **Advanced Pagination & Filtering** | Efficient data handling for large-scale issue tracking |
| 🔍 **Full-Text Search** | Query issues by title, description, and metadata |
| 📊 **Global Exception Handling** | Clean, consistent API error responses |
| 🔗 **CORS Support** | Secure cross-origin requests from frontend applications |

---

## 🏗️ Architecture

### Technology Stack
```
Backend:     Java 17 | Spring Boot 3.5.10 | Spring Security
Database:    MySQL 8.0+ | JPA/Hibernate ORM
Security:    JWT (JJWT 0.12.3) | BCrypt Password Encoding
API:         REST with Pagination & Filtering
```

### Repository Structure
```
backend/issue-management-backend/issue-management/
├── src/main/java/com/issue_management/
│   ├── controller/          # REST API endpoints
│   ├── service/             # Business logic & AI processing
│   ├── model/               # JPA entities (User, Role, Issue)
│   ├── dto/                 # Data Transfer Objects
│   ├── repository/          # Database access layer
│   ├── config/              # Security, JWT, Data initialization
│   ├── util/                # Utilities (JWT Provider, User Details)
│   └── exception/           # Global exception handling
├── src/main/resources/
│   └── application.properties  # Configuration
└── pom.xml                  # Maven dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+**
- **MySQL 8.0+**
- **Maven 3.8+**
- **Node.js 18+** (for frontend)

### Backend Setup

#### 1. Clone & Navigate
```bash
git clone https://github.com/pratham-ahuja05/issue-management-system.git
cd backend/issue-management-backend/issue-management
```

#### 2. Configure Database
Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/issue_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

#### 3. Configure JWT (Optional)
```properties
jwt.secret=your_secret_key_here_min_32_chars
jwt.expiration=86400000  # 24 hours
```

#### 4. Build & Run
```bash
mvn clean install
mvn spring-boot:run
```

Backend will start at `http://localhost:8080`

---

## 🔐 Authentication & Authorization

### Role Hierarchy
```
┌─────────────────────────────────────────┐
│ ADMIN                                   │
│ └─ Full system access                   │
│    ├─ Create, Read, Update, Delete      │
│    ├─ User management                   │
│    └─ System administration             │
├─────────────────────────────────────────┤
│ MANAGER                                 │
│ └─ Team & issue management              │
│    ├─ Create, Read, Update issues       │
│    └─ View team activities              │
├─────────────────────────────────────────┤
│ ANALYST                                 │
│ └─ Analysis & reporting                 │
│    ├─ Create, Read, Update issues       │
│    └─ Generate analytics                │
├─────────────────────────────────────────┤
│ VIEWER                                  │
│ └─ Read-only access                     │
│    └─ View issues & reports             │
└─────────────────────────────────────────┘
```

### API Endpoints

#### Authentication
```bash
# Register
POST /auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

# Login
POST /auth/login
{
  "username": "john_doe",
  "password": "securePassword123"
}

# Get Current User
GET /users/me
Headers: Authorization: Bearer <jwt_token>
```

#### Issue Management
```bash
# Create Issue (ANALYST, MANAGER, ADMIN)
POST /issues

# Get All Issues (VIEWER, ANALYST, MANAGER, ADMIN)
GET /issues?page=0&size=5

# Get Issue by ID
GET /issues/{id}

# Update Issue (ANALYST, MANAGER, ADMIN)
PUT /issues/{id}

# Delete Issue (ADMIN only)
DELETE /issues/{id}

# Search Issues
GET /issues/search?query=bug
```

**Full API documentation:** See [AUTHENTICATION.md](AUTHENTICATION.md)

---

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=jdbc:mysql://localhost:3306/issue_db
DATABASE_USER=root
DATABASE_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key_here_min_32_chars
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com

# AI/ML
GROQ_API_KEY=your_groq_api_key_for_ai_features
```

### Application Properties
```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/issue_db
spring.datasource.username=root
spring.datasource.password=${DATABASE_PASSWORD}
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=${JWT_SECRET:default_secret_key}
jwt.expiration=${JWT_EXPIRATION:86400000}

# Logging
logging.level.root=INFO
logging.level.com.issue_management=DEBUG
```

---

## 📊 Database Schema

### Entity Relationships
```
users (1) ──→ (M) user_roles ←── (M) roles
    │
    ├─ id
    ├─ username (UNIQUE)
    ├─ email (UNIQUE)
    ├─ password (BCrypt)
    ├─ enabled
    └─ created_at

issues
    ├─ id
    ├─ title
    ├─ description
    ├─ status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
    ├─ priority (LOW, MEDIUM, HIGH, CRITICAL)
    ├─ created_by
    ├─ assigned_to
    ├─ created_at
    ├─ updated_at
    └─ is_deleted (soft-delete)
```

---

## 🔒 Security Features

✅ **JWT Authentication** - Stateless, scalable token-based auth  
✅ **BCrypt Password Hashing** - Industry-standard password encryption  
✅ **Role-Based Access Control** - Granular permission management  
✅ **CORS Protection** - Cross-origin request validation  
✅ **SQL Injection Prevention** - Parameterized queries via JPA  
✅ **Global Exception Handling** - No sensitive info in error responses  
✅ **Input Validation** - All DTOs validated with Jakarta validation  
✅ **Soft-Delete** - Audit trail maintained for deleted records  

---

## 🧪 Testing the API

### Using cURL
```bash
# Register
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"pass123"}'

# Create Issue
curl -X POST http://localhost:8080/issues \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Bug","description":"Description"}'
```

### Using Postman
1. Create a POST request to `http://localhost:8080/auth/login`
2. Copy the returned JWT token
3. Add `Authorization: Bearer <token>` header to subsequent requests
4. Test issue endpoints

---

## 📈 Performance Optimization

- ✅ **Pagination** - Limit result sets to improve query performance
- ✅ **Indexing** - Database indexes on frequently queried columns
- ✅ **Connection Pooling** - HikariCP for efficient DB connections
- ✅ **Stateless Sessions** - JWT removes session storage overhead
- ✅ **Query Optimization** - JPA eager/lazy loading strategies
- ✅ **Caching** - Ready for Spring Cache integration

---

## 🛣️ Roadmap

### Completed ✅
- [x] JWT-based authentication
- [x] Role-based access control
- [x] Issue lifecycle management
- [x] Soft-delete functionality
- [x] Global exception handling

### In Progress 🚧
- [ ] Advanced AI analytics
- [ ] Real-time notifications
- [ ] Performance caching layer
- [ ] Audit logging system

### Planned 📋
- [ ] Refresh token mechanism
- [ ] Rate limiting
- [ ] Event-driven architecture
- [ ] Mobile app support
- [ ] Webhook integrations

---

## ⚠️ Known Limitations

- Initial role assignment is VIEWER (admins must elevate users manually)
- Duplicate detection accuracy depends on AI model quality
- No built-in rate limiting (recommended for production)
- Single-machine deployment (clustering requires additional setup)

---

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:

1. **Security** - Implement refresh tokens, 2FA, audit logging
2. **Performance** - Add caching, database query optimization
3. **AI/ML** - Improve duplicate detection and summarization
4. **Features** - Email notifications, webhooks, analytics dashboard
5. **Testing** - Unit & integration test coverage
6. **Documentation** - API specs, architecture diagrams

---

## 📖 Documentation

- **API Reference:** [AUTHENTICATION.md](AUTHENTICATION.md) - Complete auth and API documentation
- **Getting Started:** See setup section above
- **Troubleshooting:** Check logs in `target/` directory

---

## 📝 License

This project is open source and available under the MIT License.

---

## ❤️ Acknowledgments

**Developed by:** Pratham  
**GitHub:** [@pratham-ahuja05](https://github.com/pratham-ahuja05)  
**Concept:** Intelligent issue tracking meets secure, scalable backend architecture

> "Building intelligent backends that watch while you build."

---

## 📞 Support & Feedback

Found a bug? Have a feature request? Open an [issue](https://github.com/pratham-ahuja05/issue-management-system/issues) on GitHub!

For detailed API documentation, authentication flow, and troubleshooting, see [AUTHENTICATION.md](AUTHENTICATION.md).

---

**Last Updated:** July 26, 2026  
**Version:** 1.0.0 (Authentication & Authorization Release)
