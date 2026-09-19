import { useState } from 'react';
import { motion } from 'framer-motion';
import { springSnappy } from '../../lib/motion';
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
          <p className="text-gold-500 text-eyebrow font-medium uppercase">Central de controle</p>
          <h1 className="text-heading sm:text-display font-semibold">
            Painel <span className="text-light">administrativo</span>
          </h1>
          <p className="text-mist-400 text-body max-w-md">
            Acompanhe a agenda do dia e mantenha o catálogo de serviços em dia.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Seções do painel"
          className="inline-flex gap-1 self-start rounded-full border border-white/[0.07] bg-white/[0.03] p-1"
        >
          {TABS.map((item) => (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`ease-smooth relative rounded-full px-4 py-2 text-[13px] transition-colors duration-200 ${
                tab === item.id ? 'text-mist-100 font-medium' : 'text-mist-400 hover:text-mist-100'
              }`}
            >
              {tab === item.id && (
                <motion.span
                  layoutId="admin-tab"
                  transition={springSnappy}
                  className="absolute inset-0 rounded-full bg-white/[0.08]"
                />
              )}
              <span className="relative">{item.label}</span>
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
