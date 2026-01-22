import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ForgotPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: url('https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;

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

const PasswordForm = styled.form`
  position: relative;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
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
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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

const SuccessMessage = styled.div`
  color: #2ecc71;
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
`;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);

    setSuccessMessage('Password reset instructions have been sent to your email');

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <ForgotPasswordContainer>
      <PasswordForm onSubmit={handleSubmit}>
        <Title>Reset Password</Title>
        <Description>
          Enter your email and we'll send you instructions to reset your password
        </Description>

        <InputGroup>
          <Label>Email Address</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </InputGroup>

        <Button type="submit">Send Reset Instructions</Button>

        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        <LinksContainer>
          <StyledLink to="/login">Back to Sign In</StyledLink>
        </LinksContainer>
      </PasswordForm>
    </ForgotPasswordContainer>
  );
}
