import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiBell, FiMoon, FiGlobe, FiShield, FiSave } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import { useTheme } from '../contexts/ThemeContext';

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

const SettingsCard = styled.div`
  background: var(--card-bg);
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  padding: 2rem;
  color: var(--text-color); // Добавляем цвет текста для всей карточки
`;

const Section = styled.div`
  margin-bottom: 2rem;
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

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
`;

const SettingLabel = styled.div`
  font-weight: 500;
  color: var(--text-color);
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${ToggleSlider} {
    background-color: var(--primary-color);
  }

  &:checked + ${ToggleSlider}:before {
    transform: translateX(26px);
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--input-bg);
  color: var(--text-color);
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--success-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #27ae60;
  }
`;

const SaveStatus = styled.span`
  color: var(--success-color);
  margin-left: 1rem;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    currency: 'USD',
    language: 'en',
    twoFactor: false,
    dataRefresh: 5,
    emailAlerts: true,
    soundAlerts: false
  });

  const [saveStatus, setSaveStatus] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (name: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSaveStatus('Settings saved successfully!');
    setTimeout(() => setSaveStatus(''), 5000);
  };

  return (
    <MainLayout title="Account Settings">
      <Container>
        <Title>Account Settings</Title>

        <SettingsCard key={theme}>
          <Section>
            <SectionTitle>
              <FiBell />
              Notifications
            </SectionTitle>

            <SettingItem>
              <SettingLabel>Enable Notifications</SettingLabel>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </SettingItem>

            <SettingItem>
              <SettingLabel>Email Alerts</SettingLabel>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) => handleChange('emailAlerts', e.target.checked)}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </SettingItem>

            <SettingItem>
              <SettingLabel>Sound Alerts</SettingLabel>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={settings.soundAlerts}
                  onChange={(e) => handleChange('soundAlerts', e.target.checked)}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </SettingItem>
          </Section>

          <Section>
            <SectionTitle>
              <FiMoon />
              Appearance
            </SectionTitle>

            <SettingItem>
              <SettingLabel>Dark Mode</SettingLabel>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleChange('darkMode', e.target.checked)}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </SettingItem>

            <SettingItem>
              <SettingLabel>Data Refresh Interval</SettingLabel>
              <Select
                value={settings.dataRefresh}
                onChange={(e) => handleChange('dataRefresh', parseInt(e.target.value))}
              >
                <option value={1}>1 second</option>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
              </Select>
            </SettingItem>
          </Section>

          <Section>
            <SectionTitle>
              <FiGlobe />
              Regional Settings
            </SectionTitle>

            <SettingItem>
              <SettingLabel>Display Currency</SettingLabel>
              <Select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="JPY">Japanese Yen (JPY)</option>
                <option value="RUB">Russian Ruble (RUB)</option>
              </Select>
            </SettingItem>

            <SettingItem>
              <SettingLabel>Language</SettingLabel>
              <Select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="ru">Russian</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </Select>
            </SettingItem>
          </Section>

          <Section>
            <SectionTitle>
              <FiShield />
              Security
            </SectionTitle>

            <SettingItem>
              <SettingLabel>Two-Factor Authentication</SettingLabel>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={settings.twoFactor}
                  onChange={(e) => handleChange('twoFactor', e.target.checked)}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </SettingItem>
          </Section>

          <ButtonContainer>
            <SaveButton onClick={handleSave}>
              <FiSave />
              Save Settings
            </SaveButton>
            {saveStatus && <SaveStatus>{saveStatus}</SaveStatus>}
          </ButtonContainer>
        </SettingsCard>
      </Container>
    </MainLayout>
  );
};

export default SettingsPage;