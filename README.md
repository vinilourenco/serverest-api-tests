# ServeRest API Automation 🚀

This project is a comprehensive automated testing suite for the **ServeRest API**, built using the **Cypress** framework. It is designed to ensure the quality, reliability, and performance of RESTful endpoints.

---

## 🛠️ Technologies & Tools

- **Framework:** [Cypress](https://www.cypress.io/)
- **Runtime:** [Node.js](https://nodejs.org/)
- **API Under Test:** [ServeRest](https://github.com/ServeRest/ServeRest/)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (usually bundled with Node.js)

---

## ⚙️ Local Environment Setup

To run the tests, you must have the ServeRest API running on your local machine.

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   cd your-repo-name

   ```

2. **Install project dependencies:**

   ```bash
   npm install

   ```

3. **Start the local API:**
   Open a terminal and run:
   ```bash
   npx serverest@latest
   ```

Note: Keep this terminal window open while executing the tests.

---

## ▶️ Running the Tests

Once the local server is active, you can execute the tests using one of the following methods:

### Desktop GUI (Interactive Mode)

Best for development, debugging, and visual tracking:
```bash
npm run cy:open

### Headless Mode (CLI)

Best for fast execution and CI/CD pipelines:
```bash
npx cypress run

[![Badge ServeRest](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/ServeRest/ServeRest/)
