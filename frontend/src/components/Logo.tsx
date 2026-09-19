import { Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link
      to={to}
      className="group ease-smooth flex items-center gap-2.5 transition duration-300"
      aria-label="Barbershop home"
    >
      <span className="border-gold-500/30 bg-gold-500/10 text-gold-400 group-hover:border-gold-500/60 group-hover:bg-gold-500/15 flex size-9 items-center justify-center rounded-xl border transition duration-300">
        <Scissors className="size-4.5" aria-hidden />
      </span>
      <span className="font-display text-mist-100 text-[15px] font-semibold tracking-tight">
        Barbershop
        <span className="text-gold-500">.</span>
      </span>
    </Link>
  );
}
