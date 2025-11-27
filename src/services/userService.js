import bcrypt from 'bcryptjs';
import { users } from '../data/users.js';

export class UserService {
  static async findByUsername(username) {
    return users.find((user) => user.username === username);
  }

  static async register(username, password) {
    const existing = await this.findByUsername(username);
    if (existing) {
      throw new Error('Username already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      passwordHash,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  }

  static async authenticate(username, password) {
    const user = await this.findByUsername(username);
    if (!user) {
      return null;
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    return matches ? user : null;
  }
}

