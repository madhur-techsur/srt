import { useState } from 'react';
import { createRequest } from '../api/requestsApi';
import type { AcknowledgmentState, ApiError } from '../types/request';

interface Props {
  onSuccess: () => void;
}

interface FormFields {
  name: string;
  title: string;
  description: string;
}

interface FieldErrors {
  name?: string;
  title?: string;
  description?: string;
}

function RequestForm({ onSuccess }: Props) {
  const [fields, setFields] = useState<FormFields>({ name: '', title: '', description: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [ack, setAck] = useState<AcknowledgmentState>({ status: 'idle' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed: FormFields = {
      name: fields.name.trim(),
      title: fields.title.trim(),
      description: fields.description.trim(),
    };
    const errors: FieldErrors = {};
    if (!trimmed.name) errors.name = 'Name is required';
    if (!trimmed.title) errors.title = 'Title is required';
    if (!trimmed.description) errors.description = 'Description is required';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setSubmitting(true);
    setAck({ status: 'idle' });
    setFieldErrors({});
    try {
      await createRequest(trimmed);
      setAck({ status: 'success', message: 'Request submitted successfully' });
      setFields({ name: '', title: '', description: '' });
      onSuccess();
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.fieldErrors && apiErr.fieldErrors.length > 0) {
        const serverFieldErrors: FieldErrors = {};
        for (const fe of apiErr.fieldErrors) {
          if (fe.field === 'name' || fe.field === 'title' || fe.field === 'description') {
            serverFieldErrors[fe.field] = fe.message;
          }
        }
        setFieldErrors(serverFieldErrors);
        setAck({ status: 'error', message: apiErr.message ?? 'Submission failed. Please check your input.' });
      } else if (apiErr.errorCode === 'VALIDATION_FAILED') {
        setAck({ status: 'error', message: 'Submission failed. Please check your input.' });
      } else {
        setAck({ status: 'error', message: 'Submission failed. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name">Name</label><br />
        <input
          id="name"
          name="name"
          type="text"
          value={fields.name}
          onChange={handleChange}
          disabled={submitting}
          data-testid="name-input"
        />
        {fieldErrors.name && (
          <span role="alert" data-field-error="name" style={{ color: 'red', display: 'block' }}>
            {fieldErrors.name}
          </span>
        )}
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <label htmlFor="title">Title</label><br />
        <input
          id="title"
          name="title"
          type="text"
          value={fields.title}
          onChange={handleChange}
          disabled={submitting}
          data-testid="title-input"
        />
        {fieldErrors.title && (
          <span role="alert" data-field-error="title" style={{ color: 'red', display: 'block' }}>
            {fieldErrors.title}
          </span>
        )}
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <label htmlFor="description">Description</label><br />
        <textarea
          id="description"
          name="description"
          value={fields.description}
          onChange={handleChange}
          disabled={submitting}
          rows={4}
          style={{ width: '100%' }}
          data-testid="description-input"
        />
        {fieldErrors.description && (
          <span role="alert" data-field-error="description" style={{ color: 'red', display: 'block' }}>
            {fieldErrors.description}
          </span>
        )}
      </div>
      {ack.status === 'success' && (
        <div role="status" data-ack="success" data-testid="success-message"
          style={{ marginTop: '0.75rem', color: 'green', fontWeight: 'bold' }}>
          {ack.message}
        </div>
      )}
      {ack.status === 'error' && (
        <div role="alert" data-ack="error" style={{ marginTop: '0.75rem', color: 'red' }}>
          {ack.message}
        </div>
      )}
      <div style={{ marginTop: '1rem' }}>
        <button type="submit" disabled={submitting} data-testid="submit-button">
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export default RequestForm;
