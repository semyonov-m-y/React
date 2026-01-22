import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiEdit, FiTrash2, FiPlus, FiSave, FiX, FiUser, FiMail, FiLock, FiAlertTriangle } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import Modal from '../components/Modal';

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
`;

const OptionalText = styled.span`
  color: var(--text-secondary);
  font-size: 0.8rem;
`;

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: var(--text-color);
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--success-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #27ae60;
  }
`;

const UsersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--card-bg);
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background: var(--primary-color);
  color: white;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--hover-bg);
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 1rem;
  color: var(--text-color);
`;

const ActionsCell = styled.td`
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${props =>
    props.$variant === 'edit' ? 'var(--warning-color)' :
    props.$variant === 'delete' ? 'var(--error-color)' : 'var(--primary-color)'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.8rem;

  &:hover {
    opacity: 0.8;
  }
`;

const RoleBadge = styled.span<{ $role: 'admin' | 'user' }>`
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.$role === 'admin' ? 'var(--warning-color)' : 'var(--primary-color)'};
  color: white;
`;

const ModalTitle = styled.h2`
  color: var(--text-color);
  margin-bottom: 1.5rem;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--text-color);

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--text-color);

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--success-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #27ae60;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--error-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #c0392b;
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--error-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #c0392b;
  }
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  font-size: 0.8rem;
  margin-top: 0.3rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
`;

// Стили для уведомлений
const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

const Notification = styled.div<{ $type: 'success' | 'error' }>`
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: ${props => props.$type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// Стили для модального окна подтверждения удаления
const DeleteModalContent = styled.div`
  text-align: center;
  padding: 1rem;
`;

const WarningIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;

  svg {
    font-size: 3rem;
    color: var(--warning-color);
  }
`;

const DeleteMessage = styled.p`
  font-size: 1.1rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const UserNameHighlight = styled.span`
  font-weight: 700;
  color: var(--error-color);
`;

const DeleteModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

/**
 * Интерфейс для данных пользователя
 */
interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

/**
 * Интерфейс для уведомления
 */
interface NotificationType {
  id: number;
  message: string;
  type: 'success' | 'error';
}

/**
 * Компонент страницы администратора для управления пользователями
 * Доступен только пользователям с ролью 'admin'
 */
const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  /**
   * Показывает уведомление
   */
  const showNotification = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    const newNotification = { id, message, type };
    setNotifications(prev => [...prev, newNotification]);

    // Автоматически удаляем уведомление через 5 секунд
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  };

  /**
   * Загрузка списка пользователей при монтировании компонента
   */
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Загружает список всех пользователей с сервера
   */
  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:3001/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Открывает модальное окно для создания нового пользователя
   */
  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user'
    });
    setErrors({ username: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  /**
   * Открывает модальное окно для редактирования пользователя
   */
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Пароль не показываем при редактировании
      role: user.role
    });
    setErrors({ username: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  /**
   * Открывает модальное окно подтверждения удаления
   */
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  /**
   * Подтверждает удаление пользователя
   */
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:3001/api/admin/users/${userToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Обновляем список пользователей
      loadUsers();
      showNotification('User deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      showNotification(errorMessage, 'error');
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  /**
   * Отменяет удаление пользователя
   */
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  /**
   * Обработчик изменения полей формы
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Очищаем ошибки при изменении поля
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  /**
   * Валидирует форму перед отправкой
   */
  const validateForm = (): boolean => {
    const newErrors = {
      username: '',
      email: '',
      password: ''
    };

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Пароль обязателен только при создании нового пользователя
    if (!editingUser && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.email && !newErrors.password;
  };

  /**
   * Сохраняет пользователя (создание или редактирование)
   */
  const handleSaveUser = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      let response;

      if (editingUser) {
        // Редактирование существующего пользователя
        response = await axios.put(
          `http://localhost:3001/api/admin/users/${editingUser.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } else {
        // Создание нового пользователя
        response = await axios.post(
          'http://localhost:3001/api/admin/users',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      if (response.data.success) {
        setIsModalOpen(false);
        loadUsers(); // Обновляем список
        showNotification(
          editingUser ? 'User updated successfully' : 'User created successfully',
          'success'
        );
      }
    } catch (error: any) {
      console.error('Error saving user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save user';
      showNotification(errorMessage, 'error');
    }
  };

  /**
   * Закрывает модальное окно и сбрасывает форму
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ username: '', email: '', password: '', role: 'user' });
    setErrors({ username: '', email: '', password: '' });
  };

  return (
    <MainLayout title="User Management">
      <Container>
        {/* Уведомления */}
        <NotificationContainer>
          {notifications.map(notification => (
            <Notification key={notification.id} $type={notification.type}>
              {notification.message}
            </Notification>
          ))}
        </NotificationContainer>

        <Header>
          <Title>User Management</Title>
          <AddButton onClick={handleAddUser}>
            <FiPlus />
            Add User
          </AddButton>
        </Header>

        {loading ? (
          <LoadingState>
            Loading users...
          </LoadingState>
        ) : users.length === 0 ? (
          <EmptyState>
            <h3>No users found</h3>
            <p>Click "Add User" to create the first user</p>
          </EmptyState>
        ) : (
          <UsersTable>
            <TableHeader>
              <tr>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Username</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Created At</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge $role={user.role}>
                      {user.role}
                    </RoleBadge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <ActionsCell>
                    <ActionButton
                      $variant="edit"
                      onClick={() => handleEditUser(user)}
                    >
                      <FiEdit />
                      Edit
                    </ActionButton>
                    <ActionButton
                      $variant="delete"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <FiTrash2 />
                      Delete
                    </ActionButton>
                  </ActionsCell>
                </TableRow>
              ))}
            </tbody>
          </UsersTable>
        )}

        {/* Модальное окно для создания/редактирования пользователя */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ModalTitle>
            {editingUser ? 'Edit User' : 'Add New User'}
          </ModalTitle>

          <Form>
            <FormGroup>
              <Label>
                <FiUser />
                Username
              </Label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter username"
              />
              {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                <FiMail />
                Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email"
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                <FiLock />
                Password
                {editingUser && <OptionalText> (leave blank to keep current)</OptionalText>}
              </Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder={editingUser ? "Enter new password" : "Enter password"}
              />
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Role</Label>
              <Select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </FormGroup>

            <ModalActions>
              <CancelButton onClick={handleCloseModal}>
                <FiX />
                Cancel
              </CancelButton>
              <SaveButton onClick={handleSaveUser}>
                <FiSave />
                {editingUser ? 'Update User' : 'Create User'}
              </SaveButton>
            </ModalActions>
          </Form>
        </Modal>

        {/* Модальное окно подтверждения удаления */}
        <Modal isOpen={isDeleteModalOpen} onClose={handleCancelDelete}>
          <DeleteModalContent>
            <WarningIcon>
              <FiAlertTriangle />
            </WarningIcon>
            <ModalTitle>Confirm Deletion</ModalTitle>
            <DeleteMessage>
              Are you sure you want to delete user <UserNameHighlight>"{userToDelete?.username}"</UserNameHighlight>?
              <br />
              This action cannot be undone.
            </DeleteMessage>
            <DeleteModalActions>
              <CancelButton onClick={handleCancelDelete}>
                <FiX />
                Cancel
              </CancelButton>
              <DeleteButton onClick={handleConfirmDelete}>
                <FiTrash2 />
                Delete User
              </DeleteButton>
            </DeleteModalActions>
          </DeleteModalContent>
        </Modal>
      </Container>
    </MainLayout>
  );
};

export default AdminPage;