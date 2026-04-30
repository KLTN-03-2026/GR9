const GuideLoginFooter = ({ links }) => {
  return (
    <footer className="mt-12 flex flex-col items-center gap-6 text-center">
      <div className="flex flex-wrap items-center justify-center gap-8">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="text-xs font-bold uppercase tracking-widest text-outline transition-colors hover:text-primary"
          >
            {link}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-full bg-white/70 px-5 py-3 ring-1 ring-outline-variant/20 backdrop-blur-xl">
        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">
          Live System Status: Operational
        </span>
      </div>
    </footer>
  );
};

export default GuideLoginFooter;
