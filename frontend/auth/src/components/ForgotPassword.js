import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { authService } from '../services/authService';
import '../styles/auth.css';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await authService.forgotPassword(values.email);
      setSuccess(true);
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess(false);
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
              <h2 className="auth-title text-center">Forgot Password</h2>
              
              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}

              {success ? (
                <div className="text-center">
                  <div className="auth-success">
                    Password reset instructions have been sent to your email.
                  </div>
                  <Link to="/auth/login" className="auth-btn mt-3">
                    Return to Login
                  </Link>
                </div>
              ) : (
                <Formik
                  initialValues={{ email: '' }}
                  validationSchema={forgotPasswordSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form>
                      <div className="auth-form-group">
                        <label htmlFor="email" className="auth-form-label">Email</label>
                        <Field
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          className={`auth-form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                        />
                        {errors.email && touched.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="auth-btn w-100"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Reset Password'}
                      </button>
                    </Form>
                  )}
                </Formik>
              )}

              <div className="mt-3 text-center">
                <Link to="/auth/login" className="auth-link">
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
