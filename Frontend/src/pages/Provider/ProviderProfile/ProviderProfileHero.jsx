import PageHero from "@/components/shared/page-hero";

export default function ProviderProfileHero() {
  return (
    <PageHero
      contentClassName="xl:items-center"
      eyebrow="Provider Profile"
      heading={
        <>
          Skyline{" "}
          <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
            Tours
          </span>
        </>
      }
      description="Curating breathtaking aerial and mountain experiences across Vietnam's most iconic coastal horizons."
      showProviderCard={false}
      rightSlot={
        <div className="w-full overflow-hidden rounded-[1.75rem] shadow-[0_20px_50px_rgba(25,28,30,0.18)] ring-4 ring-white/70 md:w-[360px] lg:w-[420px]">
          <img
            alt="Skyline view of Da Nang"
            className="h-[240px] w-full object-cover lg:h-[260px]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ1sYAY_s4vribM_EUrzBNV-FAMlS9OSyRnNe-KuD9VAlh18DZ2eBhYE4ypQJWStntYMz0k0bicjJPZpnioiIb2zePCd9nfVQPT9QDpVzXA1_4cfAv-zIWPGwIRseP_YcaOZXD3PIpFeolMUaDl6JvVYX0pjV4BBdoEh4spIBZkAvMjiBlPKo4Nmdyt9422sIPmucNK_rvHjUy9hWghzeK1ocQw44I_tKYYK_OxUUwJh2HBWppMSnRsKr8BXGlzG82o8ODpLLCDAPT"
          />
        </div>
      }
    />
  );
}
