import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const AdminPage: React.FC = () => {
  const { isAdmin, toggleAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleToggleAdmin = () => {
    toggleAdmin();
    
    if (isAdmin) {
      navigate('/');
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <p>This page is only accessible to administrators.</p>
      
      <div className="admin-controls">
        <h2>Admin Controls</h2>
        <div className="admin-toggle">
          <label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={handleToggleAdmin}
            />
            Administrator Mode
          </label>
          <p className="admin-hint">
            {isAdmin 
              ? 'You currently have administrator privileges.' 
              : 'Enable to access admin features.'
            }
          </p>
        </div>
        
        {isAdmin && (
          <div className="admin-features">
            <h3>Admin Features</h3>
            <ul>
              <li>User Management</li>
              <li>Content Moderation</li>
              <li>Analytics Dashboard</li>
              <li>System Settings</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;