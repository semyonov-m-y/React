import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchPosts, createPost, CreatePostRequest } from '../store/slices/postsSlice';
import CreatePostModal from '../components/CreatePostModal';

const PostsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleCreatePost = async (values: CreatePostRequest) => {
    try {
      await dispatch(createPost(values)).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Posts</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Create New Post
        </Button>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <p>No posts yet. Create the first one!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <img
                src={post.url}
                alt={post.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />
              <p>{post.body}</p>
              <div>Rating: {post.rate} / 5</div>
              <small>{new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>

      <CreatePostModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default PostsPage;