import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--text-color);
`;

const StyledLink = styled(Link)`
  color: var(--button-bg);
  text-decoration: none;
  font-weight: 500;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  background-color: var(--card-bg);
  transition: all 0.3s;

  &:hover {
    background-color: var(--button-bg);
    color: white;
  }
`;

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <Title>404</Title>
      <Subtitle>Page Not Found</Subtitle>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <StyledLink to="/dashboard">Go to Dashboard</StyledLink>
    </Container>
  );
};

export default NotFoundPage;