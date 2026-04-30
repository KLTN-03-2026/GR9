const GuideLoginBrand = ({ brand }) => {
  return (
    <div className="mb-10 text-center">
      <div className="mb-6 inline-flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container">
          <span
            className="material-symbols-outlined text-on-primary"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            {brand.icon}
          </span>
        </div>
        <span className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">
          {brand.name}
        </span>
      </div>
    </div>
  );
};

export default GuideLoginBrand;
