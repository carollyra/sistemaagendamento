import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-stone-800 px-4 py-6 text-center text-xs text-stone-500">
        Barbershop Scheduling · Mon–Sat, 09:00–19:00
      </footer>
    </div>
  );
}
