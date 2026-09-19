import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../services/api';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await signIn({ email, password });
      toast.success(`Bem-vindo de volta, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'ADMIN' ? '/admin' : redirectTo, { replace: true });
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, 'Não foi possível entrar'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Que bom te ver de novo"
      subtitle="Entre para agendar e acompanhar seus horários."
      footer={
        <>
          Ainda não tem conta?{' '}
          <Link
            to="/register"
            className="text-gold-400 hover:text-gold-300 font-medium underline-offset-4 hover:underline"
          >
            Criar agora
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@email.com"
        />

        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
        />

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} className="mt-2">
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}
