import { postService } from '../services/postService.js';

export const postsController = {
  async getPosts(req, res) {
    try {
      const posts = await postService.getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Error fetching posts' });
    }
  },

  async createPost(req, res) {
    try {
      const { title, body, url, rate } = req.body;

      // Validation
      if (!title || title.length < 1 || title.length > 50) {
        return res.status(400).json({ message: 'Title must be between 1 and 50 characters' });
      }

      if (!body || body.length < 1 || body.length > 1000) {
        return res.status(400).json({ message: 'Body must be between 1 and 1000 characters' });
      }

      if (!url || !url.startsWith('http')) {
        return res.status(400).json({ message: 'URL must start with http' });
      }

      if (rate < 1 || rate > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }

      const newPost = await postService.createPost({
        title,
        body,
        url,
        rate,
        userId: 1 // Temporarily hardcoded
      });

      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Error creating post' });
    }
  },

  async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await postService.getPostById(parseInt(id));

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'Error fetching post' });
    }
  },

  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const success = await postService.deletePost(parseInt(id));

      if (!success) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Error deleting post' });
    }
  }
};