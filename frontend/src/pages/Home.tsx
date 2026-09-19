import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Skeleton';
import { useAuth } from '../hooks/useAuth';
import { useNextSlots } from '../hooks/useNextSlots';
import { usePublicServices } from '../hooks/usePublicServices';
import { staggerContainer, staggerItem } from '../lib/motion';
import { formatDayLabel, formatDuration, formatPrice, formatTime } from '../utils/format';

const steps = [
  {
    title: 'Escolha o serviço',
    description: 'Cada corte e barba com duração e preço reais — sem surpresas.',
  },
  {
    title: 'Escolha o dia',
    description: 'Três semanas de agenda, sempre em sincronia com a cadeira.',
  },
  {
    title: 'Pegue seu horário',
    description: 'Só aparecem horários livres. Confirmou, está feito.',
  },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { services, isLoading, error } = usePublicServices();
  const featuredService = services[0];
  const nextSlots = useNextSlots(featuredService?.id);
  const hasPreview = Boolean(featuredService && nextSlots && nextSlots.slots.length > 0);

  const primaryTo = isAuthenticated ? '/book' : '/register';
  const priceFrom = services.length > 0 ? Math.min(...services.map((s) => s.price)) : null;

  return (
    <div className="flex flex-col gap-24 sm:gap-32">
      {/* Hero */}
      <section
        className={`grid items-center gap-14 pt-6 sm:pt-12 ${
          hasPreview ? 'lg:grid-cols-[1.15fr_0.85fr]' : ''
        }`}
      >
        <div className="flex flex-col items-start gap-8">
          <span className="border-ink-700 bg-ink-850/80 text-mist-300 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs">
            <span className="bg-gold-500 size-1.5 animate-pulse rounded-full" aria-hidden />
            Agenda aberta · Seg a sáb
          </span>

          <div className="max-w-3xl">
            <h1 className="font-display text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl">
              {isAuthenticated ? (
                <>
                  Olá, <span className="text-gradient">{user?.name.split(' ')[0]}</span>. Bora para
                  a cadeira?
                </>
              ) : (
                <>
                  A barbearia que <span className="text-gradient">respeita o seu tempo</span>
                </>
              )}
            </h1>

            <p className="text-mist-400 mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
              Horários em tempo real, confirmação na hora e uma agenda que nunca dobra reserva.
              Escolha o serviço, pegue seu horário e apareça no capricho.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link to={primaryTo} className="sm:w-auto">
              <Button size="lg" fullWidth>
                {isAuthenticated ? 'Agendar horário' : 'Criar minha conta'}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>

            <Link to={isAuthenticated ? '/appointments' : '/login'} className="sm:w-auto">
              <Button size="lg" variant="secondary" fullWidth>
                {isAuthenticated ? 'Meus agendamentos' : 'Já tenho conta'}
              </Button>
            </Link>
          </div>

          <dl className="border-ink-800 grid w-full grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-4">
            {[
              { label: 'Aberto', value: 'Seg–Sáb' },
              { label: 'Horário', value: '09h–19h' },
              { label: 'Serviços', value: isLoading ? '—' : String(services.length) },
              {
                label: 'A partir de',
                value: priceFrom === null ? '—' : formatPrice(priceFrom),
              },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="text-mist-500 text-[11px] tracking-[0.15em] uppercase">
                  {stat.label}
                </dt>
                <dd className="font-display text-mist-100 text-xl font-semibold tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Live preview of today's remaining times */}
        {featuredService && nextSlots && hasPreview && (
          <aside className="rounded-panel border-ink-700/70 bg-ink-850/60 shadow-panel animate-fade-up hidden flex-col gap-6 border p-7 lg:flex">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-mist-500 text-[11px] tracking-[0.15em] uppercase">
                  Livre {formatDayLabel(nextSlots.date).toLowerCase()}
                </p>
                <h2 className="font-display mt-2 text-lg font-medium">{featuredService.name}</h2>
              </div>
              <span className="text-gold-400 font-display text-lg font-semibold tabular-nums">
                {formatPrice(featuredService.price)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {nextSlots.slots.slice(0, 4).map((slot) => (
                <Link
                  key={slot.startsAt}
                  to={primaryTo}
                  className="border-ink-700 bg-ink-900/70 text-mist-200 hover:border-gold-500/50 hover:text-gold-300 rounded-xl border py-3 text-center text-sm tabular-nums transition duration-200"
                >
                  {formatTime(slot.startsAt)}
                </Link>
              ))}
            </div>

            <p className="text-mist-500 border-ink-700/70 border-t pt-5 text-xs leading-relaxed">
              Os horários mudam conforme os clientes agendam. Reservou, sai da lista de todo mundo.
            </p>
          </aside>
        )}
      </section>

      {/* Services */}
      <section className="flex flex-col gap-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-gold-500 text-xs font-medium tracking-[0.2em] uppercase">
              O cardápio
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Serviços e preços</h2>
          </div>
          <p className="text-mist-400 max-w-sm text-sm leading-relaxed">
            Direto do catálogo da barbearia — durações e preços sempre atualizados.
          </p>
        </header>

        {error && <Alert tone="error">{error}</Alert>}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="surface flex flex-col gap-3 p-6">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <Alert>O catálogo está sendo atualizado. Volte em instantes.</Alert>
        ) : (
          <motion.ul
            className="grid gap-4 sm:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {services.map((service) => (
              <motion.li
                key={service.id}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <Link
                  to={primaryTo}
                  className="surface surface-hover group flex h-full flex-col gap-3 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-medium">{service.name}</h3>
                    <span className="text-gold-400 font-display shrink-0 text-lg font-semibold tabular-nums">
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  {service.description && (
                    <p className="text-mist-400 text-sm leading-relaxed">{service.description}</p>
                  )}

                  <div className="border-ink-700/70 mt-auto flex items-center justify-between border-t pt-4">
                    <span className="text-mist-500 text-xs">
                      {formatDuration(service.durationMinutes)}
                    </span>
                    <span className="text-mist-400 group-hover:text-gold-400 flex items-center gap-1.5 text-xs transition">
                      Agendar
                      <ArrowRight className="size-3.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </section>

      {/* How it works */}
      <section className="flex flex-col gap-8">
        <header>
          <p className="text-gold-500 text-xs font-medium tracking-[0.2em] uppercase">
            Como funciona
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Três passos e pronto</h2>
        </header>

        <motion.ol
          className="grid gap-4 sm:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="surface flex flex-col gap-3 p-6"
            >
              <span className="border-gold-500/30 bg-gold-500/10 text-gold-400 font-display flex size-9 items-center justify-center rounded-xl border text-sm font-semibold">
                {index + 1}
              </span>
              <h3 className="font-display text-base font-medium">{step.title}</h3>
              <p className="text-mist-400 text-sm leading-relaxed">{step.description}</p>
            </motion.li>
          ))}
        </motion.ol>
      </section>

      {/* CTA */}
      <section className="rounded-panel border-ink-700/70 bg-ink-850/60 aurora shadow-panel relative overflow-hidden border px-6 py-14 text-center sm:px-16 sm:py-20">
        <h2 className="font-display mx-auto max-w-2xl text-3xl leading-tight font-semibold text-balance sm:text-4xl">
          Sua cadeira está a um toque
        </h2>
        <p className="text-mist-400 mx-auto mt-4 max-w-md text-sm leading-relaxed">
          Junte-se a quem parou de esperar no telefone.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to={primaryTo}>
            <Button size="lg">{isAuthenticated ? 'Agendar agora' : 'Começar agora'}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
