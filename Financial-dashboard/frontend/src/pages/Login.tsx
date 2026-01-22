import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

// Styled components
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: url('https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;
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

const LoginForm = styled.form`
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  width: 100%;
  max-width: 450px;
  margin: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
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

const Input = styled.input`
  width: calc(100% - 2rem);
  padding: 0.8rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;

  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(to right, #3498db, #2c3e50);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const RememberContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const RememberLabel = styled.label`
  color: #fff;
  margin-left: 0.5rem;
  cursor: pointer;
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const StyledLink = styled(Link)`
  color: #3078a9;
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
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 6px;
  padding: 0.8rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
`;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Обработчик отправки формы логина
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Sending login request for user:', username);

      const response = await axios.post('http://localhost:3001/api/login', {
        username,
        password
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        // Сохраняем данные пользователя и токен
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);

        if (rememberMe) {
          localStorage.setItem('rememberedUser', username);
        } else {
          localStorage.removeItem('rememberedUser');
        }

        console.log('Login successful, redirecting to dashboard');
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Financial Dashboard</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <InputGroup>
          <Label>Username</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            disabled={loading}
          />
        </InputGroup>
        <InputGroup>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </InputGroup>

        <RememberContainer>
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={handleRememberChange}
            disabled={loading}
          />
          <RememberLabel htmlFor="remember">Remember me</RememberLabel>
        </RememberContainer>

        <Button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <LinksContainer>
          <StyledLink to="/forgot-password">Forgot password?</StyledLink>
          <StyledLink to="/register">Create account</StyledLink>
        </LinksContainer>
      </LoginForm>
    </LoginContainer>
  );
}