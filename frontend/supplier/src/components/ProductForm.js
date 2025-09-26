import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { supplierService } from '../services/supplierService';
import '../styles/supplier.css';

const productSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  price: Yup.number()
    .positive('Price must be positive')
    .required('Required'),
  categoryId: Yup.string().required('Required'),
  quantity: Yup.number()
    .min(0, 'Stock cannot be negative')
    .required('Required'),
  imageUrls: Yup.array()
    .of(Yup.string().url('Must be a valid URL'))
    .max(10, 'Maximum 10 images allowed')
});

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await supplierService.getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  const initialValues = product ? {
    ...product,
    imageUrls: product.imageUrls || []
  } : {
    name: '',
    description: '',
    price: '',
    categoryId: '',
    quantity: 0,
    imageUrls: []
  };

  return (
    <div className="product-form-card">
        <h3 className="product-form-title">
          {product ? 'Edit Product' : 'Add New Product'}
        </h3>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={productSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await onSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="supplier-form-group">
                <label htmlFor="name" className="supplier-form-label">Product Name</label>
                <Field
                  name="name"
                  className={`supplier-form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                  placeholder="Enter product name"
                />
                {errors.name && touched.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="supplier-form-group">
                <label htmlFor="description" className="supplier-form-label">Description</label>
                <Field
                  name="description"
                  as="textarea"
                  className={`supplier-form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                  placeholder="Enter product description"
                />
                {errors.description && touched.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="supplier-form-group">
                    <label htmlFor="price" className="supplier-form-label">Price</label>
                    <Field
                      name="price"
                      type="number"
                      step="0.01"
                      className={`supplier-form-control ${errors.price && touched.price ? 'is-invalid' : ''}`}
                      placeholder="0.00"
                    />
                    {errors.price && touched.price && (
                      <div className="invalid-feedback">{errors.price}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="supplier-form-group">
                    <label htmlFor="quantity" className="supplier-form-label">Stock Quantity</label>
                    <Field
                      name="quantity"
                      type="number"
                      className={`supplier-form-control ${errors.quantity && touched.quantity ? 'is-invalid' : ''}`}
                      placeholder="0"
                    />
                    {errors.quantity && touched.quantity && (
                      <div className="invalid-feedback">{errors.quantity}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="supplier-form-group">
                <label htmlFor="categoryId" className="supplier-form-label">Category</label>
                <Field
                  as="select"
                  name="categoryId"
                  className={`supplier-form-control ${errors.categoryId && touched.categoryId ? 'is-invalid' : ''}`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                {errors.categoryId && touched.categoryId && (
                  <div className="invalid-feedback">{errors.categoryId}</div>
                )}
              </div>

              <div className="supplier-form-group">
                <label className="supplier-form-label">Product Images (Optional, max 10)</label>
                <Field name="imageUrls">
                  {({ field, form }) => (
                    <div>
                      {field.value.map((url, index) => (
                        <div key={index} className="image-url-group">
                          <div className="image-url-input">
                            <input
                              type="url"
                              className={`supplier-form-control ${
                                form.errors.imageUrls?.[index] && form.touched.imageUrls?.[index]
                                  ? 'is-invalid'
                                  : ''
                              }`}
                              value={url}
                              onChange={(e) => {
                                const newUrls = [...field.value];
                                newUrls[index] = e.target.value;
                                form.setFieldValue('imageUrls', newUrls);
                              }}
                              placeholder="Enter image URL"
                            />
                            <button
                              type="button"
                              className="supplier-btn supplier-btn-danger"
                              onClick={() => {
                                const newUrls = field.value.filter((_, i) => i !== index);
                                form.setFieldValue('imageUrls', newUrls);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                          {form.errors.imageUrls?.[index] && form.touched.imageUrls?.[index] && (
                            <div className="invalid-feedback d-block">
                              {form.errors.imageUrls[index]}
                            </div>
                          )}
                        </div>
                      ))}
                      {field.value.length < 10 && (
                        <button
                          type="button"
                          className="supplier-btn supplier-btn-secondary mt-2"
                          onClick={() => {
                            form.setFieldValue('imageUrls', [...field.value, '']);
                          }}
                        >
                          Add Image URL
                        </button>
                      )}
                      {form.errors.imageUrls && typeof form.errors.imageUrls === 'string' && (
                        <div className="invalid-feedback d-block mt-2">
                          {form.errors.imageUrls}
                        </div>
                      )}
                    </div>
                  )}
                </Field>
              </div>

              <div className="supplier-btn-group">
                <button
                  type="button"
                  className="supplier-btn supplier-btn-secondary"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="supplier-btn supplier-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
    </div>
  );
};

export default ProductForm;
