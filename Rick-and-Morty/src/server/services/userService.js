import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, '../data', 'db.users.json');

const userService = {
  // Ensure users file exists
  async ensureUsersFile() {
    try {
      await fs.access(USERS_FILE);
      console.log('✅ Users file exists');
      return true;
    } catch (error) {
      console.log('📝 Creating new users file');
      await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
      await fs.writeFile(USERS_FILE, JSON.stringify([]));
      return true;
    }
  },

  // Read users from file
  async readUsers() {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading users file:', error.message);
      return [];
    }
  },

  // Write users to file
  async writeUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  },

  // Find user by email
  async findUserByEmail(email) {
    const users = await this.readUsers();
    return users.find(user => user.email === email);
  },

  // Find user by ID
  async findUserById(id) {
    const users = await this.readUsers();
    return users.find(user => user.id === id);
  },

  // Create new user
  async createUser(userData) {
    const users = await this.readUsers();

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await this.writeUsers(users);

    return newUser;
  }
};

export { userService };