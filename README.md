# E-Commerce

A online web application based on Vue to simulate a online commercial service.

## Implementation

### Frontend
Utilized Vue.js with routers for frontend development. The frontend is a single page application that communicates with the backend through RESTful API. 

### Backend
Utilized Node.js with Express framework for backend development. The backend is a RESTful API that communicates with the frontend through HTTP requests. Sessions are used to maintain user login status, and JWT is used to verify user identity. Load balancing is implemented using Nginx.

### Database
Utilized MongoDB for database development. The database is a NoSQL database that stores the data of the application. Including user information, product information, order information, etc. 

## Test and Deploy

Test is fully automated using Playwright. The test script is located in `test/`. The test script will automatically create a new user, login, add products to cart, and checkout. The test script will also automatically delete the user after the test is completed.
Use the built-in continuous integration in GitLab.