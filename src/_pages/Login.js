import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../_scss/Login.scss';
import { setCookie } from '../utils/cookieUtils';

const Login = ({ apiUrl, loginEndpoint, bodyFields }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if required props are defined
      if (!apiUrl || !loginEndpoint || !bodyFields || !bodyFields.userInput || !bodyFields.password) {
        throw new Error('Missing required props');
      }

      const response = await fetch(`${apiUrl}${loginEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [bodyFields.userInput]: formData.identifier,
          [bodyFields.password]: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      console.log('User logged in successfully:', data);
      if (data.jwt) {
        setCookie('jwt', data.jwt, 115);
        setCookie('user', JSON.stringify(data.user), 115);

        window.location.href = '/blogs';
        alert('Login successful!');
      } else {
        alert('Login Unsuccessful');
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      alert('Error logging in user');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Check if required props are defined before rendering
  if (!apiUrl || !loginEndpoint || !bodyFields || !bodyFields.userInput || !bodyFields.password) {
    return <p>Required props are missing.</p>;
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email or Username:</label>
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

Login.propTypes = {
  apiUrl: PropTypes.string,
  loginEndpoint: PropTypes.string,
  bodyFields: PropTypes.shape({
    userInput: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }),
};

export default Login;