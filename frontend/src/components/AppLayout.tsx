import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

export function AppLayout() {
  return (
    <div className="bg-ink-950 flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <div className="animate-fade-up mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
