import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../services/api';

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};

    if (form.name.trim().length < 3) {
      errors.name = 'Name must have at least 3 characters';
    }

    if (form.password.length < 6) {
      errors.password = 'Password must have at least 6 characters';
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
      });
      navigate('/', { replace: true });
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Could not create the account'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes less than a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-gold-400 hover:text-gold-300 font-medium underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && <Alert tone="error">{error}</Alert>}

        <Input
          label="Full name"
          autoComplete="name"
          required
          value={form.name}
          error={fieldErrors.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder="Maria Silva"
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder="you@mail.com"
        />

        <Input
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          placeholder="11 99999-8888"
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          value={form.password}
          error={fieldErrors.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder="At least 6 characters"
        />

        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          value={form.confirmPassword}
          error={fieldErrors.confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
          placeholder="Repeat your password"
        />

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} className="mt-2">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
