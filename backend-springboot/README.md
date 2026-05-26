# ☕ Coffee Shop API (Spring Boot Backend)

This is a production-ready, high-performance Spring Boot backend for the Coffee Shop application. It is a drop-in replacement for the original Node.js/Express backend, maintaining identical API routes, request/response models, and security behaviors, allowing the React (Vite) frontend to run without modifications.

---

## 🛠️ Technology Stack

- **Core Framework:** Spring Boot 3.2.5 (Java 17+)
- **Database:** Supabase PostgreSQL
- **ORM / Persistence:** Spring Data JPA + Hibernate
- **Security:** Spring Security + JSON Web Tokens (JJWT 0.12.5) + BCrypt (strength 12)
- **JSON Utility:** Jackson (for handling complex types like `OrderItem` JSON arrays)
- **Utility:** Lombok (for boilerplate-free models), Spring Boot Actuator (for health checks)

---

## 📁 Directory Structure

```text
backend-springboot/
│
├── .maven/                              # Local Maven wrapper/binary files
├── src/
│   ├── main/
│   │   ├── java/com/coffeeshop/
│   │   │   ├── CoffeeShopApplication.java # Entry Point
│   │   │   ├── config/                  # CORS, Data Seeding, and JPA configs
│   │   │   ├── controller/              # REST Endpoints (Auth, Products, Orders, Health)
│   │   │   ├── converter/               # JPA converters (e.g. List<OrderItem> to JSON String)
│   │   │   ├── dto/                     # Request and Response Transfer Objects
│   │   │   ├── entity/                  # Database Models (User, Product, Order)
│   │   │   ├── exception/               # Custom Exceptions & Global Exception Handler
│   │   │   ├── repository/              # Spring Data JPA Repository Interfaces
│   │   │   ├── security/                # JWT Filter, Utility, Entry Points, UserDetails
│   │   │   └── service/                 # Business Logic Implementations
│   │   │
│   │   └── resources/
│   │       ├── application.properties    # Configuration (DB, JWT, Ports, Log Levels)
│   │       └── schema.sql               # Optional manual DDL script for Supabase SQL Editor
│   └── test/
│       └── java/com/coffeeshop/         # Integration & Unit Tests
│
├── pom.xml                              # Maven Dependencies
└── run.bat                              # Execution script for Windows
```

---

## ⚙️ Setup & Configuration

### 1. Database Connection

The application is pre-configured to connect to the Supabase PostgreSQL database. If you need to update connection parameters, edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?prepareThreshold=0
spring.datasource.username=postgres.xadkmyuwnnzzznaavrkx
spring.datasource.password=CoffeeShopOnline@
```

> [!NOTE]
> The database tables will be automatically created on the first run via Hibernate's DDL Auto-update (`spring.jpa.hibernate.ddl-auto=update`).
> Alternatively, you can use the SQL commands in [schema.sql](file:///c:/project1/Coffe%20project/backend-springboot/src/main/resources/schema.sql) in the Supabase SQL editor to create the tables manually.

### 2. JWT Configuration

The secret key and token expiration time are configured in `application.properties`:

```properties
app.jwt.secret=coffee_shop_super_secret_key_2026_extended_for_hs256_security_production
app.jwt.expiration-ms=604800000
```

---

## 🚀 Running the Application

### Option A: Using the Windows Batch Script (Recommended)

Run the automated script in the root of the backend folder:

```cmd
run.bat
```

*This script will verify your Java environment, check for Maven, download it locally into `.maven` if it's missing, and launch the Spring Boot application on port `5000`.*

### Option B: Manual Launch

If you have Maven installed globally, run:

```bash
mvn spring-boot:run
```

Once running, the backend will be available at **`http://localhost:5000`**.

---

## 📋 API Endpoints

### 🔐 Authentication

| Endpoint | Method | Security | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Register a new user account |
| `/api/auth/login` | `POST` | Public | Authenticate user and receive a JWT |
| `/api/auth/me` | `GET` | Authenticated | Retrieve the authenticated user's details |

#### Register Request Shape:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

#### Login Request Shape:
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

#### Authentication Response Shape:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "USER"
  }
}
```

---

### ☕ Products

| Endpoint | Method | Security | Description |
|---|---|---|---|
| `/api/products` | `GET` | Public | Get all products available in the shop |
| `/api/products/{id}` | `GET` | Public | Get details of a specific product by ID |

> [!TIP]
> The database automatically seeds 10 default products on startup if the `products` table is empty.

---

### 📦 Orders

| Endpoint | Method | Security | Description |
|---|---|---|---|
| `/api/orders` | `POST` | Authenticated | Place a new order |
| `/api/orders` | `GET` | Authenticated | Retrieve order history for the authenticated user |

#### Create Order Request Shape:
```json
{
  "items": [
    {
      "id": 1,
      "name": "Americano",
      "price": 150.00,
      "quantity": 2,
      "image": "/assets/americano.jpg"
    }
  ],
  "totalAmount": 300.00
}
```

---

### 🩺 Health Checks

| Endpoint | Method | Security | Description |
|---|---|---|---|
| `/api/health` | `GET` | Public | Simple service status check |
| `/actuator/health` | `GET` | Public | Deep Spring Boot health check |
