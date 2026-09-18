import { useState } from 'react';
import { AdminAgenda } from './AdminAgenda';
import { AdminServices } from './AdminServices';

const TABS = [
  { id: 'agenda', label: "Today's agenda" },
  { id: 'services', label: 'Services' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function Admin() {
  const [tab, setTab] = useState<TabId>('agenda');

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Admin panel</h1>
        <p className="mt-1 text-sm text-stone-400">
          Manage the service catalogue and follow the daily schedule.
        </p>
      </header>

      <div className="flex gap-2 border-b border-stone-800">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === item.id
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'agenda' ? <AdminAgenda /> : <AdminServices />}
    </section>
  );
}
