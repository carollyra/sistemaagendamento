import { motion } from 'framer-motion';
import { ArrowRight, CalendarCheck, Clock3, MapPin, Scissors, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Skeleton';
import { useAuth } from '../hooks/useAuth';
import { useNextSlots } from '../hooks/useNextSlots';
import { usePublicServices } from '../hooks/usePublicServices';
import { useServiceAvailability } from '../hooks/useServiceAvailability';
import { images, serviceImage } from '../lib/images';
import { spring, staggerContainer, staggerItem } from '../lib/motion';
import { formatDayLabel, formatDuration, formatPrice, formatTime, greeting } from '../utils/format';

const steps = [
  {
    icon: Scissors,
    title: 'Escolha o serviço',
    description: 'Cada corte e barba com duração e preço reais — sem surpresas.',
  },
  {
    icon: CalendarCheck,
    title: 'Escolha o dia',
    description: 'Três semanas de agenda, sempre em sincronia com a cadeira.',
  },
  {
    icon: Clock3,
    title: 'Pegue seu horário',
    description: 'Só aparecem horários livres. Confirmou, está feito.',
  },
];

const highlights = [
  { value: '4,9', label: 'Avaliação média', icon: Star },
  { value: '12 anos', label: 'Na mesma esquina', icon: MapPin },
  { value: '30 min', label: 'Corte médio', icon: Clock3 },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { services, isLoading, error } = usePublicServices();
  const availability = useServiceAvailability(services);
  const featuredService = services[0];
  const nextSlots = useNextSlots(featuredService?.id);
  const hasPreview = Boolean(featuredService && nextSlots && nextSlots.slots.length > 0);

  const primaryTo = isAuthenticated ? '/book' : '/register';
  const priceFrom = services.length > 0 ? Math.min(...services.map((s) => s.price)) : null;

  return (
    <div className="flex flex-col gap-14">
      {/* Personal greeting, as in a native app header */}
      {isAuthenticated && user && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} />
            <div>
              <p className="text-mist-500 text-xs">{greeting()},</p>
              <p className="font-display text-mist-100 text-base font-bold tracking-tight">
                {user.name.split(' ')[0]}
              </p>
            </div>
          </div>

          <Link to="/appointments">
            <Button variant="secondary" size="sm">
              Meus agendamentos
            </Button>
          </Link>
        </div>
      )}

      {/* Hero */}
      <section className="rounded-panel relative flex min-h-[30rem] overflow-hidden sm:min-h-[34rem]">
        <img
          src={images.hero()}
          alt="Cadeira de barbeiro em couro"
          className="photo absolute inset-0 size-full object-cover"
        />
        <div className="photo-scrim absolute inset-0" aria-hidden />
        <div className="bg-ink-950/35 absolute inset-0" aria-hidden />

        <div className="relative mt-auto flex flex-col gap-6 p-7 pt-24 sm:p-10 sm:pt-32">
          <span className="border-mist-100/20 bg-ink-950/50 text-mist-100 inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs backdrop-blur">
            <span className="bg-gold-400 size-1.5 animate-pulse rounded-full" aria-hidden />
            Agenda aberta · Seg a sáb · 09h–19h
          </span>

          <h1 className="font-display text-display sm:text-hero max-w-3xl font-semibold text-balance text-white">
            {isAuthenticated ? (
              <>
                Pronto para a <span className="text-light text-mist-300">próxima cadeira</span>?
              </>
            ) : (
              <>
                A barbearia que{' '}
                <span className="text-light text-mist-300">respeita o seu tempo</span>
              </>
            )}
          </h1>

          <p className="text-mist-300 text-body max-w-md">
            Horários em tempo real, confirmação na hora e uma agenda que nunca dobra reserva.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to={primaryTo}>
              <Button size="lg" fullWidth>
                {isAuthenticated ? 'Agendar horário' : 'Criar minha conta'}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>

            {!isAuthenticated && (
              <Link to="/login">
                <Button size="lg" variant="secondary" fullWidth>
                  Já tenho conta
                </Button>
              </Link>
            )}
          </div>

          <dl className="border-mist-100/15 grid grid-cols-2 gap-5 border-t pt-6 sm:grid-cols-4">
            {[
              { label: 'Aberto', value: 'Seg–Sáb' },
              { label: 'Horário', value: '09h–19h' },
              { label: 'Serviços', value: isLoading ? '—' : String(services.length) },
              { label: 'A partir de', value: priceFrom === null ? '—' : formatPrice(priceFrom) },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="text-mist-300/80 text-[11px] tracking-[0.15em] uppercase">
                  {stat.label}
                </dt>
                <dd className="font-display text-lg font-bold tabular-nums text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Next free times */}
      {featuredService && nextSlots && hasPreview && (
        <section className="surface flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={serviceImage(featuredService.name, { width: 200, height: 200 })}
                alt=""
                loading="lazy"
                className="photo size-12 rounded-xl object-cover"
              />
              <div>
                <p className="text-mist-500 text-[11px] tracking-[0.15em] uppercase">
                  Livre {formatDayLabel(nextSlots.date).toLowerCase()}
                </p>
                <p className="font-display text-base font-bold tracking-tight">
                  {featuredService.name}
                </p>
              </div>
            </div>

            <span className="text-gold-400 font-display text-lg font-bold tabular-nums">
              {formatPrice(featuredService.price)}
            </span>
          </div>

          <div className="scroll-row">
            {nextSlots.slots.slice(0, 8).map((slot) => (
              <Link
                key={slot.startsAt}
                to={primaryTo}
                className="border-ink-700 bg-ink-900 text-mist-200 hover:border-gold-500/60 hover:text-gold-300 flex h-11 shrink-0 snap-start items-center rounded-full border px-5 text-sm tabular-nums transition-colors duration-200"
              >
                {formatTime(slot.startsAt)}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      <section className="flex flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-gold-500 text-eyebrow font-medium uppercase">O cardápio</p>
            <h2 className="text-heading mt-2 font-semibold">
              Serviços <span className="text-light">e preços</span>
            </h2>
          </div>

          <Link
            to={primaryTo}
            className="text-mist-400 hover:text-gold-300 flex items-center gap-1.5 text-sm transition"
          >
            Ver agenda
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </header>

        {error && <Alert tone="error">{error}</Alert>}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="rounded-media h-56" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <Alert>O catálogo está sendo atualizado. Volte em instantes.</Alert>
        ) : (
          <motion.ul
            className="grid gap-4 sm:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {services.map((service) => (
              <motion.li
                key={service.id}
                variants={staggerItem}
                whileHover={{ scale: 1.02 }}
                transition={spring}
              >
                <Link
                  to={primaryTo}
                  className="group rounded-media bg-ink-900 ease-smooth flex h-full flex-col overflow-hidden border border-white/[0.06] transition-colors duration-300 hover:border-white/[0.16]"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={serviceImage(service.name)}
                      alt={service.name}
                      loading="lazy"
                      className="photo ease-smooth size-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="photo-scrim absolute inset-0 opacity-80" aria-hidden />
                    <span className="bg-ink-950/70 text-mist-100 absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] backdrop-blur">
                      {formatDuration(service.durationMinutes)}
                    </span>
                    <h3 className="font-display absolute right-4 bottom-3 left-4 text-lg font-bold tracking-tight text-white">
                      {service.name}
                    </h3>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-4">
                    {service.description && (
                      <p className="text-mist-400 text-sm leading-relaxed">{service.description}</p>
                    )}

                    <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-mist-100 text-title font-semibold tabular-nums">
                          {formatPrice(service.price)}
                        </span>
                        {availability[service.id]?.when && (
                          <span className="text-mist-500 text-meta">
                            {availability[service.id].count} livres {availability[service.id].when}
                          </span>
                        )}
                      </div>
                      <span className="text-mist-400 group-hover:text-gold-400 flex items-center gap-1.5 text-meta transition">
                        Agendar
                        <ArrowRight className="size-3.5" aria-hidden />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </section>

      {/* Shop highlights over a photo */}
      <section className="rounded-panel border-ink-700/70 relative overflow-hidden border">
        <img
          src={images.shop()}
          alt="Salão da Fade Barbearia"
          loading="lazy"
          className="photo absolute inset-0 size-full object-cover"
        />
        <div className="photo-scrim absolute inset-0" aria-hidden />

        <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-md">
            <p className="text-gold-400 text-eyebrow font-medium uppercase">A casa</p>
            <h2 className="text-heading mt-3 font-semibold text-white">
              Cadeira de barbeiro, <span className="text-light text-mist-300">clima de bar</span>
            </h2>
            <p className="text-mist-200 mt-3 text-sm leading-relaxed">
              Tijolo aparente, luz quente e uma equipe que conhece o seu corte de cor. Chegue dez
              minutos antes e tome um café.
            </p>
          </div>

          <dl className="flex flex-wrap gap-4">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="border-mist-100/15 bg-ink-950/50 min-w-36 rounded-2xl border p-4 backdrop-blur"
              >
                <item.icon className="text-gold-400 size-4" aria-hidden />
                <dd className="font-display mt-2 text-xl font-bold text-white">{item.value}</dd>
                <dt className="text-mist-300 text-xs">{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How it works */}
      <section className="flex flex-col gap-6">
        <header>
          <p className="text-gold-500 text-eyebrow font-medium uppercase">Como funciona</p>
          <h2 className="text-heading mt-2 font-semibold">
            Três passos <span className="text-light">e pronto</span>
          </h2>
        </header>

        <motion.ol
          className="grid gap-4 sm:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              variants={staggerItem}
              whileHover={{ scale: 1.02 }}
              transition={spring}
              className="surface flex flex-col gap-3 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="border-gold-500/30 bg-gold-500/10 text-gold-400 flex size-10 items-center justify-center rounded-xl border">
                  <step.icon className="size-4.5" aria-hidden />
                </span>
                <span className="font-display text-ink-600 text-3xl font-extrabold">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-display text-base font-bold tracking-tight">{step.title}</h3>
              <p className="text-mist-400 text-sm leading-relaxed">{step.description}</p>
            </motion.li>
          ))}
        </motion.ol>
      </section>

      {/* CTA */}
      <section className="rounded-panel border-ink-700/70 bg-ink-850 flex flex-col items-center gap-5 border px-6 py-12 text-center sm:px-16">
        <h2 className="font-display text-heading max-w-xl font-semibold text-balance">
          Sua cadeira <span className="text-light">está a um toque</span>
        </h2>
        <p className="text-mist-400 max-w-md text-sm leading-relaxed">
          Junte-se a quem parou de esperar no telefone.
        </p>
        <Link to={primaryTo}>
          <Button size="lg">{isAuthenticated ? 'Agendar agora' : 'Começar agora'}</Button>
        </Link>
      </section>
    </div>
  );
}
