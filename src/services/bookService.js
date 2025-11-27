import { books } from '../data/books.js';

const simulateLatency = () =>
  new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 30)));

const normalize = (value) => value?.toLowerCase().trim();

export class BookService {
  static async getAllBooks() {
    await simulateLatency();
    return Object.values(books);
  }

  static async getByIsbn(isbn) {
    await simulateLatency();
    return books[isbn];
  }

  static async getByAuthor(author) {
    await simulateLatency();
    const search = normalize(author);
    return Object.values(books).filter(
      (book) => normalize(book.author) === search
    );
  }

  static async getByTitle(title) {
    await simulateLatency();
    const search = normalize(title);
    return Object.values(books).filter(
      (book) => normalize(book.title) === search
    );
  }

  static async getReviews(isbn) {
    await simulateLatency();
    const book = books[isbn];
    return book ? book.reviews : null;
  }

  static async addOrUpdateReview(isbn, username, reviewData) {
    await simulateLatency();
    const book = books[isbn];
    if (!book) {
      throw new Error('Book not found');
    }

    book.reviews[username] = {
      rating: reviewData.rating,
      comment: reviewData.comment,
      updatedAt: new Date().toISOString()
    };

    return book.reviews[username];
  }

  static async deleteReview(isbn, username) {
    await simulateLatency();
    const book = books[isbn];
    if (!book || !book.reviews[username]) {
      throw new Error('Review not found');
    }

    delete book.reviews[username];
    return true;
  }
}

