import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="flex flex-col items-start gap-6 py-10">
      <div>
        <p className="text-sm font-medium text-amber-400">Barbershop Scheduling</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {isAuthenticated ? `Hello, ${user?.name.split(' ')[0]}!` : 'Book your next haircut'}
        </h1>
        <p className="mt-3 max-w-xl text-stone-400">
          Pick a service, choose a day and grab the time that works for you. No phone calls, no
          waiting in line.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {isAuthenticated ? (
          <>
            <Link to="/book">
              <Button>Book an appointment</Button>
            </Link>
            <Link to="/appointments">
              <Button variant="secondary">My appointments</Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/register">
              <Button>Create account</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Sign in</Button>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
