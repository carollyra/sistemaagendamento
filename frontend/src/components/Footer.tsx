export function Footer() {
  return (
    <footer className="border-ink-800/80 border-t">
      <div className="text-mist-500 mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs sm:flex-row sm:px-8">
        <p>© {new Date().getFullYear()} Fade Barbearia. Todos os direitos reservados.</p>
        <p className="flex items-center gap-2">
          <span className="bg-gold-500/70 size-1 rounded-full" aria-hidden />
          Segunda a sábado · 09h – 19h
        </p>
      </div>
    </footer>
  );
}
