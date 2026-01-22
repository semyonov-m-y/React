import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POSTS_FILE = path.join(__dirname, '../data', 'db.posts.json');

const postService = {
  // Ensure posts file exists
  async ensurePostsFile() {
    try {
      await fs.access(POSTS_FILE);
      console.log('✅ Posts file exists');
      return true;
    } catch (error) {
      console.log('📝 Creating new posts file');
      await fs.mkdir(path.dirname(POSTS_FILE), { recursive: true });
      await fs.writeFile(POSTS_FILE, JSON.stringify([]));
      return true;
    }
  },

  // Read posts from file
  async readPosts() {
    try {
      const data = await fs.readFile(POSTS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading posts file:', error.message);
      return [];
    }
  },

  // Write posts to file
  async writePosts(posts) {
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
  },

  // Get all posts
  async getAllPosts() {
    await this.ensurePostsFile();
    return this.readPosts();
  },

  // Create new post
  async createPost(postData) {
    await this.ensurePostsFile();
    const posts = await this.readPosts();

    const newPost = {
      id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      ...postData,
      createdAt: new Date().toISOString()
    };

    posts.push(newPost);
    await this.writePosts(posts);

    return newPost;
  },

  // Get post by ID
  async getPostById(id) {
    const posts = await this.readPosts();
    return posts.find(post => post.id === id);
  },

  // Delete post
  async deletePost(id) {
    const posts = await this.readPosts();
    const filteredPosts = posts.filter(post => post.id !== id);

    if (filteredPosts.length === posts.length) {
      return false;
    }

    await this.writePosts(filteredPosts);
    return true;
  }
};

export { postService };