import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FiUser, FiMail, FiPhone, FiLock, FiEdit, FiSave, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import { useTheme } from '../contexts/ThemeContext';

const InputField = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1.1rem;
  margin-right: 0.5rem;
  background-color: var(--input-bg);
  color: var(--text-color);

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const UserNameInput = styled(InputField)`
  max-width: 302px;
`;

const EmailInput = styled(InputField)`
  max-width: 300px;
`;

const FieldInput = styled(InputField)`
  max-width: 300px;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;

  &:hover {
    background: var(--button-hover);
  }
`;

const SaveButton = styled(EditButton)`
  background: var(--success-color);

  &:hover {
    background: #27ae60;
  }
`;

const PasswordButton = styled(SaveButton)<{ disabled: boolean }>`
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: var(--text-color);
  margin-bottom: 2rem;
`;

const ProfileCard = styled.div`
  background: var(--card-bg);
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  padding: 2rem;
  margin-bottom: 2rem;
  color: var(--text-color); // Добавляем цвет текста для всей карточки
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  position: relative;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 300px;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #2c3e50);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  margin-right: 1.5rem;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  max-width: 400px;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  color: var(--text-color);
`;

const UserEmail = styled.div`
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 0.5rem;
`;

const CancelButton = styled(EditButton)`
  background: var(--error-color);
  margin-right: 0.5rem;

  &:hover {
    background: #c0392b;
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
`;

const InfoValue = styled.div`
  font-size: 1.1rem;
  color: var(--text-color);
`;

const TextAreaField = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1.1rem;
  min-height: 100px;
  resize: vertical;
  background-color: var(--input-bg);
  color: var(--text-color);

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-self: flex-start;
  flex-shrink: 0;
  margin-left: 1rem;
`;

const ChangePasswordButton = styled(EditButton)`
  background: var(--primary-color);

  &:hover {
    background: #5a6268;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--card-bg);
  border-radius: 10px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: var(--card-shadow);
`;

const ModalHeader = styled.h3`
  margin-top: 0;
  color: var(--text-color);
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const PasswordInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  font-size: 0.8rem;
  margin-top: 0.3rem;
`;

const PasswordHint = styled.div`
  color: var(--error-color);
  font-size: 0.8rem;
  margin-top: 0.3rem;
`;

const SuccessMessage = styled.span`
  color: var(--success-color);
  margin-left: 1rem;
  font-weight: 500;
`;

const ProfilePage: React.FC = () => {
  // Получаем текущего пользователя из localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const [user, setUser] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    position: currentUser.position || '',
    department: currentUser.department || '',
    location: currentUser.location || '',
    bio: currentUser.bio || '',
    lastLogin: currentUser.lastLogin || new Date().toLocaleString()
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState({ ...user });
  const [successMessage, setSuccessMessage] = useState('');
  const { theme } = useTheme();

  // Состояния для модального окна смены пароля
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Эффект для проверки валидности формы при изменении полей
  useEffect(() => {
    validateForm();
  }, [currentPassword, newPassword, confirmPassword]);

  const handleEditProfile = () => {
    setTempUser({ ...user });
    setIsEditing(true);
  };

  /**
   * Обработчик сохранения профиля с отправкой данных на сервер
   */
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        'http://localhost:3001/api/user/profile',
        {
          username: tempUser.name,
          email: tempUser.email,
          phone: tempUser.phone,
          position: tempUser.position,
          department: tempUser.department,
          location: tempUser.location,
          bio: tempUser.bio
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Обновляем данные пользователя в localStorage
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));

        setUser({ ...tempUser });
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');

        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      alert(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setTempUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordErrors({ current: '', new: '', confirm: '' });
  };

  // Функция для проверки сложности пароля
  const validatePasswordComplexity = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>-]/.test(password);

    return {
      hasUpperCase,
      hasNumbers,
      hasSpecialChar,
      isValid: hasUpperCase && hasNumbers && hasSpecialChar
    };
  }

  /**
   * Валидация формы пароля
   */
  const validateForm = () => {
    const errors = {
      current: '',
      new: '',
      confirm: ''
    };

    // Проверка текущего пароля
    if (!currentPassword) {
      errors.current = 'Current password is required';
    }

    // Проверка нового пароля
    if (!newPassword) {
      errors.new = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.new = 'Password must be at least 8 characters';
    } else {
      const complexity = validatePasswordComplexity(newPassword);
      if (!complexity.isValid) {
        errors.new = 'Password must contain uppercase letters, numbers, and special characters';
      }
    }

    // Проверка подтверждения пароля
    if (newPassword !== confirmPassword) {
      errors.confirm = 'Passwords do not match';
    }

    setPasswordErrors(errors);

    // Проверяем, можно ли активировать кнопку сохранения
    const isValid = !errors.current && !errors.new && !errors.confirm &&
                   currentPassword !== '' && newPassword !== '' && confirmPassword !== '';

    setIsFormValid(isValid);

    // Возвращаем результат проверки
    return !errors.current && !errors.new && !errors.confirm;
  };

  // Обработчики изменений полей
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  // Функция для проверки сложности пароля (возвращает булево значение)
  const isPasswordValid = (password: string) => {
    const complexity = validatePasswordComplexity(password);
    return complexity.isValid && password.length >= 8;
  };

  /**
   * Обработчик смены пароля с отправкой данных на сервер
   */
  const handleSavePassword = async () => {
    if (validateForm()) {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.put(
          'http://localhost:3001/api/user/change-password',
          {
            currentPassword,
            newPassword
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setSuccessMessage('Password changed successfully!');
          closePasswordModal();

          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
        }
      } catch (error: any) {
        console.error('Error changing password:', error);
        const errorMessage = error.response?.data?.message || 'Failed to change password';

        // Устанавливаем ошибку для текущего пароля
        setPasswordErrors(prev => ({
          ...prev,
          current: errorMessage
        }));
      }
    }
  };

  // Проверяем валидность формы пароля
  const isPasswordFormValid = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return false;

    if (newPassword.length < 8) return false;

    const complexity = validatePasswordComplexity(newPassword);
    if (!complexity.isValid) return false;

    if (newPassword !== confirmPassword) return false;

    return true;
  };

  return (
    <MainLayout title="Profile">
      <Container>
        <Title>Your Profile</Title>

        <ProfileCard key={theme}>
          <ProfileHeader>
            <AvatarSection>
              <Avatar><FiUser /></Avatar>
              <UserInfo>
                {isEditing ? (
                  <UserNameInput
                    value={tempUser.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                ) : (
                  <UserName>{user.name}</UserName>
                )}
                <UserEmail>
                  <FiMail />
                  {isEditing ? (
                    <EmailInput
                      value={tempUser.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  ) : (
                    user.email
                  )}
                </UserEmail>
              </UserInfo>
            </AvatarSection>

            {isEditing ? (
              <ButtonContainer>
                <CancelButton onClick={handleCancelEdit}>
                  <FiX />
                  Cancel
                </CancelButton>
                <SaveButton onClick={handleSaveProfile}>
                  <FiSave />
                  Save Changes
                </SaveButton>
              </ButtonContainer>
            ) : (
              <EditButton onClick={handleEditProfile}>
                <FiEdit />
                Edit Profile
              </EditButton>
            )}
          </ProfileHeader>

          <Section>
            <SectionTitle>
              <FiUser />
              Personal Information
            </SectionTitle>

            <InfoGrid>
              <InfoItem>
                <InfoLabel>Phone</InfoLabel>
                {isEditing ? (
                  <InputField
                    value={tempUser.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                ) : (
                  <InfoValue>
                    <FiPhone />
                    {user.phone}
                  </InfoValue>
                )}
              </InfoItem>

              <InfoItem>
                <InfoLabel>Position</InfoLabel>
                {isEditing ? (
                  <InputField
                    value={tempUser.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                  />
                ) : (
                  <InfoValue>{user.position}</InfoValue>
                )}
              </InfoItem>

              <InfoItem>
                <InfoLabel>Department</InfoLabel>
                {isEditing ? (
                  <InputField
                    value={tempUser.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                  />
                ) : (
                  <InfoValue>{user.department}</InfoValue>
                )}
              </InfoItem>

              <InfoItem>
                <InfoLabel>Location</InfoLabel>
                {isEditing ? (
                  <InputField
                    value={tempUser.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                ) : (
                  <InfoValue>{user.location}</InfoValue>
                )}
              </InfoItem>
            </InfoGrid>
          </Section>

          <Section>
            <SectionTitle>About Me</SectionTitle>
            {isEditing ? (
              <TextAreaField
                value={tempUser.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
              />
            ) : (
              <InfoValue>{user.bio}</InfoValue>
            )}
          </Section>

          <Section>
            <SectionTitle>
              <FiLock />
              Security
            </SectionTitle>
            <MessageContainer>
              <ChangePasswordButton onClick={handleChangePassword}>
                <FiEdit />
                Change Password
              </ChangePasswordButton>
              {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            </MessageContainer>
          </Section>
        </ProfileCard>

        {/* Модальное окно для смены пароля */}
        {isPasswordModalOpen && (
          <ModalOverlay onClick={closePasswordModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>Change Password</ModalHeader>

              <InfoItem>
                <InfoLabel>Current Password</InfoLabel>
                <PasswordInputContainer>
                  <InputField
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                    onBlur={validateForm}
                    placeholder="Enter current password"
                  />
                  <PasswordToggle onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </PasswordInputContainer>
                {passwordErrors.current && <ErrorMessage>{passwordErrors.current}</ErrorMessage>}
              </InfoItem>

              <InfoItem>
                <InfoLabel>New Password</InfoLabel>
                <PasswordInputContainer>
                  <InputField
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    onBlur={validateForm}
                    placeholder="Enter new password (min 8 characters)"
                  />
                  <PasswordToggle onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </PasswordInputContainer>
                {passwordErrors.new && <ErrorMessage>{passwordErrors.new}</ErrorMessage>}
                {newPassword && !isPasswordValid(newPassword) && (
                  <PasswordHint>
                    Must contain uppercase letters, numbers, and special characters
                  </PasswordHint>
                )}
              </InfoItem>

              <InfoItem>
                <InfoLabel>Confirm New Password</InfoLabel>
                <PasswordInputContainer>
                  <InputField
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onBlur={validateForm}
                    placeholder="Confirm new password"
                  />
                  <PasswordToggle onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </PasswordInputContainer>
                {passwordErrors.confirm && <ErrorMessage>{passwordErrors.confirm}</ErrorMessage>}
              </InfoItem>

              <ModalActions>
                <CancelButton onClick={closePasswordModal}>
                  <FiX />
                  Cancel
                </CancelButton>
                <SaveButton
                  onClick={handleSavePassword}
                  disabled={!isFormValid}
                  style={{ opacity: isFormValid ? 1 : 0.6 }}
                >
                  <FiSave />
                  Save Changes
                </SaveButton>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </MainLayout>
  );
};

export default ProfilePage;