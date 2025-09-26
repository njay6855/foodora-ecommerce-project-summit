import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { registerSchema } from '../utils/validationSchemas';
import { authService } from '../services/authService';
import '../styles/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role
      });
      navigate('/auth/login');
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
              <h2 className="auth-title text-center">Register</h2>
              
              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}

              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  role: 'Customer'
                }}
                validationSchema={registerSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="auth-form-group">
                      <label htmlFor="name" className="auth-form-label">Name</label>
                      <Field
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        className={`auth-form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                      />
                      {errors.name && touched.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

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

                    <div className="auth-form-group">
                      <label htmlFor="password" className="auth-form-label">Password</label>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className={`auth-form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                      />
                      {errors.password && touched.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <div className="auth-form-group">
                      <label htmlFor="confirmPassword" className="auth-form-label">Confirm Password</label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        className={`auth-form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>

                    <div className="auth-form-group">
                      <label htmlFor="role" className="auth-form-label">Register as</label>
                      <Field
                        as="select"
                        name="role"
                        className={`auth-form-control ${errors.role && touched.role ? 'is-invalid' : ''}`}
                      >
                        <option value="Customer">Customer</option>
                        <option value="Supplier">Supplier</option>
                      </Field>
                      {errors.role && touched.role && (
                        <div className="invalid-feedback">{errors.role}</div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="auth-btn w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                  </Form>
                )}
              </Formik>

              <div className="mt-3 text-center">
                <span className="auth-divider">Already have an account?{' '}</span>
                <Link to="/auth/login" className="auth-link">
                  Login here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
