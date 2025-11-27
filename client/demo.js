import axios from 'axios';

const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const api = axios.create({ baseURL: BASE_URL, timeout: 5000 });

export const getAllBooksCallback = (callback) => {
  api
    .get('/books')
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

export const searchByIsbnPromise = (isbn) =>
  api.get(`/books/isbn/${isbn}`).then((res) => res.data);

export const searchByAuthorAsync = async (author) => {
  const response = await api.get(`/books/author/${author}`);
  return response.data;
};

export const searchByTitleAsync = async (title) => {
  const response = await api.get(`/books/title/${title}`);
  return response.data;
};

const logDivider = () => console.log('='.repeat(40));

const runDemo = async () => {
  console.log(`Using API base URL: ${BASE_URL}`);
  logDivider();

  getAllBooksCallback((err, books) => {
    if (err) {
      console.error('Callback error (Task 10):', err.message);
      return;
    }
    console.log('Task 10 - All books via callback', books.map((b) => b.title));
  });

  try {
    const book = await searchByIsbnPromise('9780140328721');
    console.log('Task 11 - Book by ISBN via Promise', book.title);
  } catch (error) {
    console.error('Task 11 error:', error.message);
  }

  try {
    const byAuthor = await searchByAuthorAsync('Harper Lee');
    console.log('Task 12 - Books by author via async/await', byAuthor.length);
  } catch (error) {
    console.error('Task 12 error:', error.message);
  }

  try {
    const byTitle = await searchByTitleAsync('Matilda');
    console.log('Task 13 - Books by title via async/await', byTitle.length);
  } catch (error) {
    console.error('Task 13 error:', error.message);
  }
};

const normalizedArg =
  process.argv[1] && process.argv[1].split('\\').join('/');
const invokedDirectly =
  normalizedArg && import.meta.url.endsWith(normalizedArg);

if (invokedDirectly) {
  runDemo();
}

