# ServeRest API Test Suite

Automated API testing project for the [ServeRest](https://github.com/ServeRest/ServeRest/) API, built with Cypress and JavaScript. The suite covers authentication, user management, and product listing — validating success paths, error handling, edge cases, and business rules.

[![Badge ServeRest](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/ServeRest/ServeRest/)
[![Cypress](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)

---

## Table of Contents

- [Objective](#objective)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Tests](#running-the-tests)
- [Test Reports](#test-reports)
- [Endpoints Tested](#endpoints-tested)
  - [Authentication — POST /login](#authentication--post-login)
  - [Users — GET /usuarios](#users--get-usuarios)
  - [Users — GET /usuarios/:id](#users--get-usuariosid)
  - [Users — POST /usuarios](#users--post-usuarios)
  - [Users — PUT /usuarios/:id](#users--put-usuariosid)
  - [Users — DELETE /usuarios/:id](#users--delete-usuariosid)
  - [Products — GET /produtos](#products--get-produtos)
- [Validation Coverage](#validation-coverage)
- [Test Data Strategy](#test-data-strategy)

---

## Objective

This project was built to practice API test automation using Cypress. It validates the ServeRest REST API against its contract — asserting correct status codes, response bodies, error messages, and business rules across all supported operations.

---

## Technologies

| Tool | Version | Purpose |
|------|---------|---------|
| [Cypress](https://www.cypress.io/) | ^15.14.1 | Test framework |
| [Node.js](https://nodejs.org/) | v14+ | Runtime |
| [Chance.js](https://chancejs.com/) | ^1.1.13 | Random test data generation |
| [Mochawesome](https://github.com/adamgruber/mochawesome) | ^1.5.5 | HTML test reports |
| [ServeRest](https://github.com/ServeRest/ServeRest/) | latest | API under test |

---

## Project Structure

```
serverest-api-tests/
├── cypress/
│   ├── e2e/
│   │   ├── auth/
│   │   │   └── login.cy.js             # POST /login tests
│   │   ├── products/
│   │   │   └── listRegisteredProducts.cy.js  # GET /produtos tests
│   │   └── users/
│   │       ├── deleteUser.cy.js        # DELETE /usuarios/:id
│   │       ├── editUser.cy.js          # PUT /usuarios/:id
│   │       ├── getUser.cy.js           # GET /usuarios/:id
│   │       ├── listUsers.cy.js         # GET /usuarios
│   │       └── registerUser.cy.js      # POST /usuarios
│   ├── fixtures/
│   │   └── example.json
│   ├── reports/                        # Mochawesome HTML reports (generated)
│   ├── screenshots/                    # Failure screenshots (generated)
│   └── support/
│       ├── commands.js                 # Custom cy.* commands
│       └── e2e.js                      # Global support configuration
├── cypress.config.js
├── package.json
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm (bundled with Node.js)

---

## Installation

**1. Clone the repository:**

```bash
git clone https://github.com/vinilourenco/serverest-api-tests.git
cd serverest-api-tests
```

**2. Install dependencies:**

```bash
npm install
```

**3. Start the ServeRest API** (keep this terminal open while running tests):

```bash
npx serverest@latest
```

The API will be available at `http://localhost:3000`.

---

## Running the Tests

| Command | Mode | Use case |
|---------|------|----------|
| `npm run cy:open` | Interactive (GUI) | Development, debugging, step-by-step inspection |
| `npm test` | Headless (CLI) | Fast execution, CI/CD pipelines |
| `npm run test:cloud` | Cloud recording | Recording runs on Cypress Cloud |

To run a single spec file:

```bash
npx cypress run --spec "cypress/e2e/auth/login.cy.js"
```

---

## Test Reports

Reports are generated automatically in `cypress/reports/` using Mochawesome. After a headless run, open `cypress/reports/mochawesome.html` in a browser to view the full results with pass/fail status, durations, and error messages.

---

## Endpoints Tested

### Authentication — POST /login

**Base path:** `/login`

#### Success

```http
POST /login
Content-Type: application/json

{
  "email": "fulano@qa.com",
  "password": "teste"
}
```

**Response 200:**
```json
{
  "message": "Login realizado com sucesso",
  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error scenarios

| Status | Scenario | Payload | Response field | Message |
|--------|----------|---------|----------------|---------|
| 401 | Invalid password | `{ "email": "fulano@qa.com", "password": "wrong" }` | `message` | Contains "inválidos" |
| 400 | Malformed email (`fulanoqa.com`) | — | `email` | "email deve ser um email válido" |
| 400 | Empty email | `{ "email": "" }` | `email` | "email não pode ficar em branco" |
| 400 | Empty password | `{ "password": "" }` | `password` | "password não pode ficar em branco" |
| 400 | Both fields empty | `{ "email": "", "password": "" }` | `email` + `password` | Both blank messages present |
| 400 | Unknown field (`username` instead of `email`) | `{ "username": "..." }` | `username` | "não é permitido" |

---

### Users — GET /usuarios

**Base path:** `/usuarios`

Supports optional query parameters: `_id`, `nome`, `email`, `administrador`.

#### Success

```http
GET /usuarios?email=fulano@qa.com
```

**Response 200:**
```json
{
  "quantidade": 1,
  "usuarios": [
    {
      "_id": "0uxuPY0cbmQhpEz1",
      "nome": "Fulano da Silva",
      "email": "fulano@qa.com",
      "password": "teste",
      "administrador": "true"
    }
  ]
}
```

#### Test coverage

| Scenario | Filter used | Expected result |
|----------|-------------|----------------|
| List all users | (none) | `quantidade` and `usuarios` present |
| Filter by `_id` | `?_id=0uxuPY0cbmQhpEz1` | `quantidade = 1`, matching user returned |
| Filter by `nome` | `?nome=Fulano da Silva` | Non-empty `usuarios` array |
| Filter by `email` | `?email=fulano@qa.com` | First user's email matches filter |
| Filter by `administrador` | `?administrador=true` | First user's `administrador = "true"` |
| Non-existent email | Random email | Empty `usuarios` array |
| Non-existent name | Random name | Empty `usuarios` array |
| Invalid query param | `?invalidParam=value` | **400** — `invalidParam` field: "não é permitido" |

---

### Users — GET /usuarios/:id

**Base path:** `/usuarios/:id`

#### Success

```http
GET /usuarios/0uxuPY0cbmQhpEz1
```

**Response 200:**
```json
{
  "_id": "0uxuPY0cbmQhpEz1",
  "nome": "Fulano da Silva",
  "email": "fulano@qa.com",
  "password": "teste",
  "administrador": "true"
}
```

#### Error scenarios

| Status | Scenario | `id` value | Response field | Message |
|--------|----------|-----------|----------------|---------|
| 400 | Empty ID | (empty) | `id` | "id deve ter exatamente 16 caracteres alfanuméricos" |
| 400 | ID too short | Short string | `id` | Same as above |
| 400 | ID too long | Long string | `id` | Same as above |
| 400 | Non-existent user | `0uxuPY0cbmQhpEz2` | `message` | "Usuário não encontrado" |
| 400 | JSON object as ID | `{"id":"0uxuPY0cbmQhpEz1"}` | `id` | "id deve ter exatamente 16 caracteres alfanuméricos" |

---

### Users — POST /usuarios

**Base path:** `/usuarios`

#### Success

```http
POST /usuarios
Content-Type: application/json

{
  "nome": "Novo Usuário",
  "email": "novo@email.com",
  "password": "teste",
  "administrador": "true"
}
```

**Response 201:**
```json
{
  "message": "Cadastro realizado com sucesso",
  "_id": "generated_id_here"
}
```

#### Error scenarios

| Status | Scenario | Response field | Message |
|--------|----------|----------------|---------|
| 400 | Invalid email format | `email` | "email deve ser um email válido" |
| 400 | Email already in use | `message` | "Este email já está sendo usado" |
| 400 | Empty `nome` | `nome` | "nome não pode ficar em branco" |
| 400 | Empty `email` | `email` | "email não pode ficar em branco" |
| 400 | Empty `password` | `password` | "password não pode ficar em branco" |
| 400 | Empty `administrador` | `administrador` | "administrador deve ser 'true' ou 'false'" |
| 400 | Missing `nome` | `nome` | "nome é obrigatório" |
| 400 | Missing `email` | `email` | "email é obrigatório" |
| 400 | Missing `password` | `password` | "password é obrigatório" |
| 400 | Missing `administrador` | `administrador` | "administrador é obrigatório" |

---

### Users — PUT /usuarios/:id

**Base path:** `/usuarios/:id`

#### Success — update existing user

```http
PUT /usuarios/0uxuPY0cbmQhpEz1
Content-Type: application/json

{
  "nome": "Updated Name",
  "email": "updated@qa.com",
  "password": "newpassword",
  "administrador": "false"
}
```

**Response 200:**
```json
{
  "message": "Registro alterado com sucesso"
}
```

#### Success — upsert (unknown valid ID creates a new user)

```http
PUT /usuarios/unknownValidFormatId
```

**Response 201:**
```json
{
  "message": "Cadastro realizado com sucesso",
  "_id": "newlyCreatedId"
}
```

#### Edge cases — status 200

| Scenario | Notable input |
|----------|--------------|
| Same email kept | Email unchanged from existing value |
| Toggle `administrador` | Flip between `"true"` / `"false"` |
| Special characters in name | `Fúlano d'Sílva Jüñíor` |
| Very long name | 200+ character string |
| Complex email domain | `user+tag@subdomain.enterprise.com.br` |
| Password with special chars | `S3nh@!C0mpl3x@#$%` |
| Very short password | Single character |
| Very long password | Repeated 20×-length string |
| Uppercase email | `UPPER@EMAIL.COM` |

#### Error scenarios — status 400

| Scenario | Response field | Message |
|----------|----------------|---------|
| Leading/trailing spaces in email | `email` | "email deve ser um email válido" |
| Email already in use by another user | `message` | "Este email já está sendo usado" |
| Empty `nome` | `nome` | "nome não pode ficar em branco" |
| Empty `email` | `email` | "email não pode ficar em branco" |
| Empty `password` | `password` | "password não pode ficar em branco" |
| Empty `administrador` | `administrador` | "administrador deve ser 'true' ou 'false'" |
| Missing `nome` | `nome` | "nome é obrigatório" |
| Missing `email` | `email` | "email é obrigatório" |
| Missing `password` | `password` | "password é obrigatório" |
| Missing `administrador` | `administrador` | "administrador é obrigatório" |
| Invalid email format | `email` | "email deve ser um email válido" |
| Email without domain | `email` | "email deve ser um email válido" |
| Invalid `administrador` value | `administrador` | "administrador deve ser 'true' ou 'false'" |
| `email` is a boolean | `email` | "email deve ser uma string" |
| Extra unknown fields | Each extra field | "não é permitido" |
| All fields set to `null` | Each field | Type/format errors per field |

---

### Users — DELETE /usuarios/:id

**Base path:** `/usuarios/:id`

#### Success — delete existing user

```http
DELETE /usuarios/{userId}
```

**Response 200:**
```json
{
  "message": "Registro excluído com sucesso"
}
```

#### Success — delete non-existent user

```http
DELETE /usuarios/0uxuPY0cbmQhpEz2
```

**Response 200:**
```json
{
  "message": "Nenhum registro excluído"
}
```

#### Business rule — user with active cart

```http
DELETE /usuarios/0uxuPY0cbmQhpEz1
```

**Response 400:**
```json
{
  "message": "Não é permitido excluir usuário com carrinho cadastrado",
  "idCarrinho": "cartId123"
}
```

---

### Products — GET /produtos

**Base path:** `/produtos`

Supports optional query parameters: `_id`, `nome`, `preco`, `descricao`, `quantidade`.

#### Success

```http
GET /produtos
```

**Response 200:**
```json
{
  "quantidade": 2,
  "produtos": [
    {
      "_id": "BeeJh5lz3k6kSIzA",
      "nome": "Logitech MX Vertical",
      "preco": 470,
      "descricao": "Mouse",
      "quantidade": 382
    }
  ]
}
```

#### Test coverage

| Test ID | Scenario | Filter | Expected result |
|---------|----------|--------|----------------|
| TC001 | No filter | (none) | `quantidade` is a number; `produtos` is an array |
| TC002 | Filter by existing `_id` | `?_id=BeeJh5lz3k6kSIzA` | `quantidade = 1`, matching product returned |
| TC003 | Filter by existing `nome` | `?nome={existingName}` | Non-empty `produtos` array |
| TC004 | Filter by existing `preco` | `?preco={existingPrice}` | Non-empty `produtos` array |
| TC005 | Filter by `descricao` | `?descricao={desc}` | Non-empty `produtos` array |
| TC006 | Filter by `quantidade` | `?quantidade={qty}` | Non-empty `produtos` array |
| TC007 | Multiple filters combined | `?nome={name}&preco={price}` | Returns matching products |
| TC008 | Non-existent name (random) | `?nome={randomName}` | `quantidade = 0`, empty array |
| TC009 | Non-existent `_id` (random) | `?_id={randomString}` | `quantidade = 0`, empty array |
| TC010 | Non-existent name | `?nome={randomString}` | Empty `produtos` array |
| TC011 | Case-sensitive filter | Lowercase `nome` | Returns products matching exact case |
| TC014 | Extremely high price | `?preco=999999` | Empty `produtos` array |
| TC016 | Extremely high quantity | `?quantidade=999999` | Empty `produtos` array |
| TC017 | URL-encoded name with spaces | `?nome=+Mouse+` | Empty `produtos` array |
| TC018 | Empty description filter | `?descricao=` | Empty `produtos` array |
| TC019 | Impossible multi-filter | `?preco=999999&quantidade=0&nome=Mouse` | Empty `produtos` array |
| TC021 | URL-encoded special characters | `?nome={encodeURIComponent(name)}` | Correct product returned |

---

## Validation Coverage

The test suite exercises the following validation categories across all endpoints:

| Category | Examples |
|----------|---------|
| **Required fields** | Missing `nome`, `email`, `password`, `administrador` |
| **Blank fields** | Empty strings for all user fields |
| **Format validation** | Invalid email formats, malformed IDs |
| **Business rules** | Duplicate email, deleting user with active cart |
| **Data types** | Boolean where string expected, `null` values |
| **Extra fields** | Unknown properties rejected by API |
| **ID format** | 16 alphanumeric characters enforced |
| **Upsert behavior** | PUT with unknown ID creates a new resource |
| **Edge cases** | Special characters, long strings, URL encoding, case sensitivity |
| **Filter combinations** | Multiple query params in a single request |

---

## Test Data Strategy

- **Random data:** [Chance.js](https://chancejs.com/) generates unique names and emails per test run, preventing state pollution between tests.
- **Setup/teardown:** `beforeEach` registers test users when needed; `afterEach` cleans them up via DELETE to keep the environment clean.
- **Fixed seed data:** ServeRest ships with a default user (`fulano@qa.com`) and products that tests rely on for read-only scenarios.
- **`failOnStatusCode: false`:** All `cy.request()` calls use this option so non-2xx responses can be asserted directly rather than failing the test implicitly.
