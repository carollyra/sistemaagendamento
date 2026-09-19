import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};

    if (form.name.trim().length < 3) {
      errors.name = 'O nome deve ter pelo menos 3 caracteres';
    }

    if (form.password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'As senhas não conferem';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await signUp({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
      });
      toast.success(`Conta criada — boas-vindas, ${user.name.split(' ')[0]}!`);
      navigate('/', { replace: true });
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, 'Não foi possível criar a conta'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Leva menos de um minuto."
      footer={
        <>
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="text-gold-400 hover:text-gold-300 font-medium underline-offset-4 hover:underline"
          >
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Nome completo"
          autoComplete="name"
          required
          value={form.name}
          error={fieldErrors.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder="Maria Silva"
        />

        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder="voce@email.com"
        />

        <Input
          label="Telefone (opcional)"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          placeholder="(11) 99999-8888"
        />

        <Input
          label="Senha"
          type="password"
          autoComplete="new-password"
          required
          value={form.password}
          error={fieldErrors.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder="Pelo menos 6 caracteres"
        />

        <Input
          label="Confirme a senha"
          type="password"
          autoComplete="new-password"
          required
          value={form.confirmPassword}
          error={fieldErrors.confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
          placeholder="Repita a senha"
        />

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} className="mt-2">
          Criar conta
        </Button>
      </form>
    </AuthLayout>
  );
}
