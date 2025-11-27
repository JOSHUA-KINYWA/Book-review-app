import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';

import { BookService } from './services/bookService.js';
import { UserService } from './services/userService.js';
import {
  createToken,
  getUserFromRequest,
  requireAuth
} from './middleware/auth.js';

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'book-review-secret';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60
    }
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/books', async (_req, res) => {
  const books = await BookService.getAllBooks();
  res.json(books);
});

app.get('/api/books/isbn/:isbn', async (req, res) => {
  const book = await BookService.getByIsbn(req.params.isbn);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  return res.json(book);
});

app.get('/api/books/author/:author', async (req, res) => {
  const books = await BookService.getByAuthor(req.params.author);
  if (!books.length) {
    return res.status(404).json({ message: 'No books for that author' });
  }
  return res.json(books);
});

app.get('/api/books/title/:title', async (req, res) => {
  const books = await BookService.getByTitle(req.params.title);
  if (!books.length) {
    return res.status(404).json({ message: 'No books for that title' });
  }
  return res.json(books);
});

app.get('/api/books/:isbn/reviews', async (req, res) => {
  const reviews = await BookService.getReviews(req.params.isbn);
  if (!reviews) {
    return res.status(404).json({ message: 'Book not found' });
  }
  return res.json(reviews);
});

app.post('/api/users/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const user = await UserService.register(username, password);
    return res.status(201).json({ username: user.username });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const user = await UserService.authenticate(username, password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  req.session.user = { username: user.username };
  const token = createToken(user);
  return res.json({
    username: user.username,
    token,
    session: true
  });
});

app.post('/api/users/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

app.post('/api/books/:isbn/reviews', requireAuth, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ message: 'Rating between 1 and 5 is required' });
  }

  const username = req.user.username;
  try {
    const review = await BookService.addOrUpdateReview(req.params.isbn, username, {
      rating,
      comment: comment ?? ''
    });
    return res.json(review);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

app.delete('/api/books/:isbn/reviews', requireAuth, async (req, res) => {
  const username = req.user.username;
  try {
    await BookService.deleteReview(req.params.isbn, username);
    return res.json({ message: 'Review removed' });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

app.get('/api/users/profile', (req, res) => {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  return res.json({ username: user.username });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Book review API listening on port ${PORT}`);
});

