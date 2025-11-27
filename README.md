# Book-review-app

## Book Review API

Node.js + Express REST API that exposes book data and supports user registration, login, and authenticated review management. The service uses both cookie sessions and JWTs so that logged-in users can work from browsers or external REST clients.

### Getting Started

1. Install dependencies
   ```
   npm install
   ```
2. Run the API
   ```
   npm start
   ```
3. (Optional) Exercise the async Axios client demo
   ```
   npm run client
   ```

The server starts on `http://localhost:3000`.

### REST Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/books` | List all books (Task 1) |
| `GET` | `/api/books/isbn/:isbn` | Fetch book by ISBN (Task 2) |
| `GET` | `/api/books/author/:author` | Filter by author (Task 3) |
| `GET` | `/api/books/title/:title` | Filter by title (Task 4) |
| `GET` | `/api/books/:isbn/reviews` | Fetch reviews (Task 5) |
| `POST` | `/api/users/register` | Register a new user (Task 6) |
| `POST` | `/api/users/login` | Login, set session, return JWT (Task 7) |
| `POST` | `/api/books/:isbn/reviews` | Add/update review (Tasks 8/10–13) |
| `DELETE` | `/api/books/:isbn/reviews` | Delete review owned by user (Task 9) |

Protected routes require the session cookie or an `Authorization: Bearer <token>` header containing the JWT returned at login.

### Async Axios Tasks

`client/demo.js` demonstrates the four asynchronous patterns required for Tasks 10–13:

- Task 10 – callback style (`getAllBooksCallback`)
- Task 11 – Promise chaining (`searchByIsbnPromise`)
- Task 12 – async/await by author (`searchByAuthorAsync`)
- Task 13 – async/await by title (`searchByTitleAsync`)

### Testing Notes

- Use Postman or curl to hit each REST endpoint and capture the required screenshots.
- Default seeded user: `admin / admin123`.
- Set `SESSION_SECRET` and `JWT_SECRET` environment variables for production use.
