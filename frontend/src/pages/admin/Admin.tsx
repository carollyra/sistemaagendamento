import { useState } from 'react';
import { AdminAgenda } from './AdminAgenda';
import { AdminServices } from './AdminServices';

const TABS = [
  { id: 'agenda', label: 'Agenda' },
  { id: 'services', label: 'Serviços' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function Admin() {
  const [tab, setTab] = useState<TabId>('agenda');

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-gold-500 text-xs font-medium tracking-[0.2em] uppercase">
            Central de controle
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Painel administrativo</h1>
          <p className="text-mist-400 max-w-lg text-sm leading-relaxed">
            Acompanhe a agenda do dia e mantenha o catálogo de serviços em dia.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Seções do painel"
          className="border-ink-700 bg-ink-850/70 inline-flex gap-1 self-start rounded-xl border p-1"
        >
          {TABS.map((item) => (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`ease-smooth rounded-lg px-4 py-2 text-sm transition duration-200 ${
                tab === item.id
                  ? 'bg-ink-700 text-mist-100 shadow-soft font-medium'
                  : 'text-mist-400 hover:text-mist-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="animate-fade-in">
        {tab === 'agenda' ? <AdminAgenda /> : <AdminServices />}
      </div>
    </section>
  );
}
