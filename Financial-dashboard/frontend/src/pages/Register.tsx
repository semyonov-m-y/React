import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const GeneralError = styled.div`
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 6px;
  padding: 0.8rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TermsLabel = styled.label`
  margin-bottom: 0;
  color: #fff;
`;

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 0;
  }
`;

const RegisterForm = styled.form`
  position: relative;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  width: 100%;
  max-width: 450px;
  margin: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 1;
`;

const Title = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 600;
`;

const Description = styled.p`
  color: #DCDCDC;
  text-align: center;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #DCDCDC;
  font-weight: 500;
`;

const Input = styled.input<{ $error?: boolean }>`
  width: calc(100% - 2rem);
  padding: 0.8rem 1rem;
  border: 1px solid ${props => props.$error ? '#e74c3c' : '#e0e0e0'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;

  &:focus {
    border-color: ${props => props.$error ? '#e74c3c' : '#3498db'};
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.$error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)'};
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 0.8rem;
  background: ${props => props.disabled ? '#95a5a6' : 'linear-gradient(to right, #3498db, #2c3e50)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s;
  margin-top: 1rem;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 5px 15px rgba(0, 0, 0, 0.1)'};
  }
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

const StyledLink = styled(Link)`
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.3rem;
  font-weight: 500;
`;

const PasswordHint = styled.div`
  color: #95a5a6;
  font-size: 0.8rem;
  margin-top: 0.3rem;
`;

const TermsLink = styled(Link)`
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }
`;

const SuccessMessage = styled.div`
  color: #2ecc71;
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
`;

const EmailHint = styled.div`
  color: #95a5a6;
  font-size: 0.8rem;
  margin-top: 0.3rem;
`;

const LoadingMessage = styled.div`
  color: #3498db;
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
`;

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  /**
   * Валидация email адреса
   */
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Проверка сложности пароля
   */
  const validatePasswordComplexity = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    return {
      hasUpperCase,
      hasNumbers,
      hasSpecialChar,
      hasMinLength,
      isValid: hasUpperCase && hasNumbers && hasSpecialChar && hasMinLength
    };
  };

  /**
   * Обработчик потери фокуса для валидации полей
   */
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  /**
   * Валидация всей формы
   */
  const validateForm = () => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    // Username validation
    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const complexity = validatePasswordComplexity(password);
      if (!complexity.isValid) {
        newErrors.password = 'Password must meet all requirements';
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
  };

  /**
   * Обработчик отправки формы регистрации
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    if (!agreeTerms) {
      setErrors(prev => ({ ...prev, confirmPassword: "You must agree to the terms and conditions" }));
      return;
    }

    setLoading(true);

    try {
      console.log('Sending registration request:', { username, email });

      const response = await axios.post('http://localhost:3001/api/register', {
        username,
        password,
        email
      });

      console.log('Registration response:', response.data);

      if (response.data.success) {
        // Сохраняем данные пользователя и токен
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);

        setSuccessMessage('Registration successful! Redirecting to dashboard...');

        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setGeneralError(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return username && email && password && confirmPassword && agreeTerms &&
           validateEmail(email) && validatePasswordComplexity(password).isValid &&
           password === confirmPassword;
  };

  const passwordComplexity = validatePasswordComplexity(password);
  const emailIsValid = email ? validateEmail(email) : false;

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <Title>Create Account</Title>
        <Description>Join our financial dashboard platform</Description>

        {generalError && <GeneralError>{generalError}</GeneralError>}

        <InputGroup>
          <Label>Username</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => handleBlur('username')}
            placeholder="Enter your username"
            required
            $error={touched.username && !!errors.username}
            disabled={loading}
          />
          {touched.username && errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="Enter your email"
            required
            $error={touched.email && !!errors.email}
            disabled={loading}
          />
          {touched.email && errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          {email && !errors.email && (
            <EmailHint style={{ color: emailIsValid ? '#2ecc71' : '#e74c3c' }}>
              {emailIsValid ? '✓ Valid email address' : 'Please enter a valid email address'}
            </EmailHint>
          )}
        </InputGroup>

        <InputGroup>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            placeholder="Create a password"
            required
            $error={touched.password && !!errors.password}
            disabled={loading}
          />
          {password && (
            <PasswordHint>
              Must contain:
              <span style={{ color: passwordComplexity.hasUpperCase ? '#2ecc71' : '#e74c3c' }}> uppercase</span>,
              <span style={{ color: passwordComplexity.hasNumbers ? '#2ecc71' : '#e74c3c' }}> numbers</span>,
              <span style={{ color: passwordComplexity.hasSpecialChar ? '#2ecc71' : '#e74c3c' }}> special characters</span>,
              <span style={{ color: passwordComplexity.hasMinLength ? '#2ecc71' : '#e74c3c' }}> min 8 characters</span>
            </PasswordHint>
          )}
          {touched.password && errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => handleBlur('confirmPassword')}
            placeholder="Confirm your password"
            required
            $error={touched.confirmPassword && !!errors.confirmPassword}
            disabled={loading}
          />
          {confirmPassword && password !== confirmPassword && (
            <PasswordHint style={{ color: '#e74c3c' }}>
              ✗ Passwords do not match
            </PasswordHint>
          )}
          {confirmPassword && password === confirmPassword && (
            <PasswordHint style={{ color: '#2ecc71' }}>
              ✓ Passwords match
            </PasswordHint>
          )}
          {touched.confirmPassword && errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <CheckboxContainer>
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={loading}
            />
            <TermsLabel htmlFor="terms">
              I agree to the <TermsLink to="/terms" target="_blank">Terms and Conditions</TermsLink>
            </TermsLabel>
          </CheckboxContainer>
        </InputGroup>

        <Button type="submit" disabled={!isFormValid() || loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>

        {loading && <LoadingMessage>Creating your account...</LoadingMessage>}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        <LinksContainer>
          <p style={{ color: '#fff' }}>Already have an account? <StyledLink to="/login">Sign In</StyledLink></p>
        </LinksContainer>
      </RegisterForm>
    </RegisterContainer>
  );
}