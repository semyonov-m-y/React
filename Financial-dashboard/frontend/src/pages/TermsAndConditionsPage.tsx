import React from 'react';
import styled from 'styled-components';
import MainLayout from '../layouts/MainLayout';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 2rem;
  text-align: center;
`;

const Content = styled.div`
  background: var(--card-bg);
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  padding: 2rem;
  color: var(--text-color);
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
`;

const Paragraph = styled.p`
  margin-bottom: 1rem;
`;

const List = styled.ul`
  margin-left: 1.5rem;
  margin-bottom: 1rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
`;

const TermsAndConditionsPage: React.FC = () => {
  return (
      <Container title="Terms and Conditions">
        <Title>Terms and Conditions</Title>
        <Content>
          <Section>
            <SectionTitle>1. Acceptance of Terms</SectionTitle>
            <Paragraph>
              By accessing and using this financial analytics platform, you accept and agree to be bound by the terms and conditions outlined in this agreement.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>2. User Account</SectionTitle>
            <Paragraph>
              To access certain features of the platform, you must register for an account. You agree to:
            </Paragraph>
            <List>
              <ListItem>Provide accurate and complete information during registration</ListItem>
              <ListItem>Maintain the security of your password</ListItem>
              <ListItem>Accept responsibility for all activities that occur under your account</ListItem>
              <ListItem>Notify us immediately of any unauthorized use of your account</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>3. Financial Data and Analysis</SectionTitle>
            <Paragraph>
              The platform provides financial data and analytical tools for informational purposes only. This information should not be considered as:
            </Paragraph>
            <List>
              <ListItem>Financial advice or recommendations</ListItem>
              <ListItem>A solicitation to buy or sell securities</ListItem>
              <ListItem>An offer to provide financial services</ListItem>
            </List>
            <Paragraph>
              Users are solely responsible for their investment decisions and should consult with qualified financial professionals before making any investment.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>4. Data Accuracy</SectionTitle>
            <Paragraph>
              While we strive to provide accurate and timely information, we cannot guarantee the completeness, reliability, or accuracy of the financial data presented. Market conditions change rapidly, and past performance is not indicative of future results.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>5. Intellectual Property</SectionTitle>
            <Paragraph>
              All content, features, and functionality of the platform, including but not limited to text, graphics, logos, and software, are the property of the company and are protected by intellectual property laws.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>6. Limitation of Liability</SectionTitle>
            <Paragraph>
              The company shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the platform, including but not limited to investment losses.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>7. Privacy Policy</SectionTitle>
            <Paragraph>
              Your use of the platform is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>8. Modifications to Terms</SectionTitle>
            <Paragraph>
              We reserve the right to modify these terms and conditions at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>9. Termination</SectionTitle>
            <Paragraph>
              We may terminate or suspend your account and access to the platform for violation of these terms or for any other reason at our discretion.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>10. Governing Law</SectionTitle>
            <Paragraph>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where the company is established.
            </Paragraph>
          </Section>

          <Paragraph>
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </Paragraph>
        </Content>
      </Container>
  );
};

export default TermsAndConditionsPage;