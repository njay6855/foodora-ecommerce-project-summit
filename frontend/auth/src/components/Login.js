import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { loginSchema } from '../utils/validationSchemas';
import { authService } from '../services/authService';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await authService.login(values.email, values.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="auth-card">
              <h2 className="auth-title text-center">Login</h2>
              
              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}

              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="auth-form-group">
                      <label htmlFor="email" className="auth-form-label">Email</label>
                      <Field
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className={`auth-form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                      />
                      {errors.email && touched.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="auth-form-group">
                      <label htmlFor="password" className="auth-form-label">Password</label>
                      <Field
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className={`auth-form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                      />
                      {errors.password && touched.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="auth-btn w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                  </Form>
                )}
              </Formik>

              <div className="mt-3 text-center">
                <Link to="/auth/forgot-password" className="auth-link">
                  Forgot Password?
                </Link>
              </div>

              <div className="mt-3 text-center">
                <span className="auth-divider">Don't have an account?{' '}</span>
                <Link to="/auth/register" className="auth-link">
                  Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
