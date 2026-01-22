import React from 'react';
import { Link } from 'react-router-dom';
import './TermsOfService.css';

const TermsOfService: React.FC = () => {
  return (
    <div className="terms-page">
      <div className="container">
        <Link to="/register" className="back-link">← Back to Registration</Link>

        <h1>Пользовательское Соглашение</h1>

        <div className="terms-content">
          <section className="terms-section">
            <h2>1. Общие положения</h2>
            <p>
              1.1. Настоящее Пользовательское соглашение (далее — Соглашение) регулирует отношения
              между владельцем приложения Rick and Morty Universe (далее — Приложение) и пользователем
              (далее — Пользователь) regarding использования Приложения.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. Права и обязанности сторон</h2>
            <p>2.1. Пользователь имеет право:</p>
            <ul className="terms-list">
              <li>Создавать учетную запись в Приложении</li>
              <li>Использовать функционал Приложения в соответствии с его назначением</li>
              <li>Отказаться от использования Приложения в любое время</li>
            </ul>

            <p>2.2. Пользователь обязуется:</p>
            <ul className="terms-list">
              <li>Предоставлять достоверную информацию при регистрации</li>
              <li>Не передавать свои учетные данные третьим лицам</li>
              <li>Соблюдать законодательство Российской Федерации</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. Конфиденциальность</h2>
            <p>
              3.1. Приложение обязуется обеспечивать конфиденциальность персональных данных
              Пользователя в соответствии с законодательством РФ.
            </p>
          </section>

          <section className="terms-section">
            <h2>4. Ограничение ответственности</h2>
            <p>
              4.1. Приложение не несет ответственности за невозможность использования сервиса
              по причинам, не зависящим от Приложения.
            </p>
          </section>

          <section className="terms-section">
            <h2>5. Заключительные положения</h2>
            <p>
              5.1. Настоящее Соглашение вступает в силу с момента его принятия Пользователем
              и действует в течение всего срока использования Приложения.
            </p>
          </section>

          <p className="terms-date">
            Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;