import React from 'react';
import { useAdmin } from '../contexts/AdminContext';

const AdminAccess: React.FC = () => {
  const { isAdmin, toggleAdmin } = useAdmin();

  return (
    <div className="admin-access">
      <h3>Admin Access</h3>
      <label>
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={toggleAdmin}
        />
        Enable Administrator Mode
      </label>
    </div>
  );
};

export default AdminAccess;