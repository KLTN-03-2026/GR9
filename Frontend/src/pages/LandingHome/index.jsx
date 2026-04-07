import React from 'react';
import { Link } from 'react-router-dom';

const valueProps = [
  {
    icon: 'auto_awesome',
    title: 'Personalized Itineraries',
    description:
      'Our AI learns your travel style to craft minute-by-minute plans perfectly balanced between hidden gems and landmarks.',
  },
  {
    icon: 'fitness_tracker',
    title: 'Live Guide Tracking',
    description:
      'Stay connected with verified local experts in real-time. Safety and local insight, just a tap away.',
  },
  {
    icon: 'sell',
    title: 'Best Local Rates',
    description:
      'Skip the tourist traps. We negotiate directly with Da Nang providers to bring you authentic pricing.',
  },
];

const steps = [
  {
    number: '1',
    title: 'Select Preferences',
    description: `Choose "Foodie", "Culture seeker", or "Relaxed pace".`,
  },
  {
    number: '2',
    title: 'AI Optimization',
    description:
      'Our engine calculates the best routes and opening hours.',
  },
  {
    number: '3',
    title: 'One-Tap Booking',
    description:
      'Instantly book tickets for Marble Mountains or Ba Na Hills.',
  },
];

const experiences = [
  {
    title: 'Ba Na Hills & Golden Bridge',
    description:
      'Experience the mountain resort and the world-famous "Hands of God" bridge with priority cable car access.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBL9pR0zY4kSNnBk3xZO68-GXolb9prvqajKTOANTaU8RkCPgGYxp6tUcsjtN69RRGorRd8ob2U_kSkKdlFePyVv9qC5n4zrFuhfz1gYizSioRYpmYqXy0AZ6yX5ohYe4xP9icnTUUKIjjNFX0YPDFpEG9xtp8O039wAT366heEU4SEw_QKByCKTRI_FYb3ufpkKqMqpoRM71tJpOpcyMQKVfWCe3OT4ShiRL2B4Ix4vXO7uHJPQNgHzcvtFzQx-eF7-EJEbpJECEfq',
    imageAlt:
      'Close up of the giant stone hands holding the Golden Bridge in Ba Na Hills, Da Nang',
    recommended: true,
  },
  {
    title: 'Hoi An Ancient Food Tour',
    description:
      'A dusk walk through the lantern-lit streets, tasting the best Cao Lau and Banh Mi in the region.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0IkcrDFeYfI0ZJiU-g4sCwLt54ckkHmPq9CYnMBKNZa1DHmWSXco79pyzSgC4gssRGMpTwoYGiJcjp506oVvPfnpZp9DQeRD3v6q4XiipuD2edDK98LPi-N-J7Z0C-JcjJZv2PxwBBCa2rNQPpiN9S0qbzq46nYanYtlpPjG44FjfvS1RrkSYSWNkLYk43bwJvjOLv2ciZYHFZ7KoHMsQqzgUyf-0XaUpU---KfqTOdsHKfpO2F8FEYv77RnPWZQXuizVlBV8KGjP',
    imageAlt:
      'Colorful lanterns glowing at night in the ancient town of Hoi An near Da Nang',
  },
  {
    title: 'Son Tra Peninsula Discovery',
    description:
      'Explore the "Monkey Mountain," the giant Lady Buddha statue, and secluded beaches with crystal clear water.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAbVkUw1OfwMyGmGHXDLL7l_QMuAyEa7RyvhP3YJTsOhu-sKM0zPuBbT4RJ1f5lrf4D8zCYIpT3iAT_Av35iZ89fj3T4rkDQh2ewDLiTtxKvhUtyLObf7Wlm2Dd1-RJz_NerFuf1mdk0PDCA5ooKFr9xiKcSR_VCoIxUW1r5u7E7012Usuid4WGn8EMAzwa8VDuYM_FO9W6LjF3rd8tMiSxSdLAhFtJC-SIjUaNnSwQClAEMCHIHErq_EeMpkLE_uEYWZPhDHaHSWKw',
    imageAlt:
      'Linh Ung Pagoda statue overlooking the coastline of Son Tra Peninsula in Da Nang',
  },
];

const roles = [
  {
    icon: 'flight_takeoff',
    title: 'For Travelers',
    description:
      'Unlock the ultimate Da Nang experience. Explore like a local, track your itinerary in real-time, and get AI-powered insights on every corner.',
    cta: 'Explore as Traveler',
    className: 'bg-surface-container-lowest text-on-surface',
    iconWrapperClass: 'bg-primary-container/20 text-primary',
  },
  {
    icon: 'storefront',
    title: 'For Providers',
    description:
      'List your tours, cafes, or stays. Use our AI tools to manage bookings and reach thousands of international travelers daily.',
    cta: 'Join Provider Portal',
    className: 'bg-primary text-on-primary',
    iconWrapperClass: 'bg-white/20 text-white',
  },
];

const stats = [
  { value: '10,000+', label: 'Trips Planned' },
  { value: '500+', label: 'Local Guides' },
  { value: '4.9/5', label: 'Average Rating', className: 'col-span-2 md:col-span-1' },
];

const testimonials = [
  {
    quote:
      "The AI planner found a local seafood place in Da Nang that wasn't on any blog. It was the highlight of our trip!",
    name: 'Sarah J.',
    country: 'United Kingdom',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC7jqZVXIVoME0giMh4SDX7OFY-4iZ3iYOfOuHA7CFfvi81-2FimNhe6k8DUYHNFOpZxL6YeAVJrD-BYbAECYHOZI7ivv0yegIDWYAltPsYXkD-ze-XlKIuvp4dSTO0xAPlc9zHtcdo532QXIC8iGYrur0fVP-oAHJ14HI4WSD9xmWSkNiSTCD0peuD-9p6nKSRxPQ46dTX7bk3fJ77ebQi1mah5b3mxLXkouAax39i3h_mKH-G2RIvsrcJyAKbwwRxF1_IvtjXt0yk',
    imageAlt: 'Portrait of a smiling young woman with glasses',
  },
  {
    quote:
      'I was skeptical about AI travel but Voyager AI actually saved us hours of transport planning between Da Nang and Hoi An.',
    name: 'Markus T.',
    country: 'Germany',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBsbD-ki1I-R4yMYB3ls1RGRUqShVqMwWfa-wFGi-OLQ7wmcE7yO0bu8XLsCellyPCG4EAZl6Imp2UkTLDkzNutvFAETyeeW6cDvFIjDCA9i026z5vHQ1z0ibndjhtj7TFahijCVHJ4AxJI3Rd_-Qgrzh9DKbby_YwnDKNiFw5kYt2E0t38glXtFonsBl3Qkxd0LrDCVwmrJb-Eb5WgtPrOQtU0t01Ljko7yg7vo9S-QBkrf_0_NgFhnigeN4nOioGyvCDPVG2AJ8IN',
    imageAlt: 'Portrait of a bearded man smiling outdoors',
  },
  {
    quote:
      'The real-time guide tracking gave me so much peace of mind as a solo traveler. Highly recommended!',
    name: 'Elena L.',
    country: 'Australia',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtKv1764CA7Hkz-dVYhiqBO7WZncXHP5G7aiulCfTGzVhxYY4srcsB7BuB1m-1ZPYoI14T1apGrV5LB1IGZAveTo8jJ-gLjeeTGdGFFoxn0SjSQiMI94luuXlm2XiEnuOcGW1QTLRGxBv9gQ_sz696u0rmu-ObFh8_ZGJ3WA_cliGk6ZWPJZGEkYZjSu54fhzE12GWJrZddlWq6yVZroidLdL9eQCJlFHGmuiFl3prp5J2XBauI1ExjIOoQiZn-rAuonzlHnJ8AY1q',
    imageAlt: 'Portrait of a young woman with a friendly smile',
  },
];

const footerGroups = [
  {
    title: 'Explore',
    links: ['Destinations', 'AI Planner', 'Live Tracking'],
  },
  {
    title: 'Solutions',
    links: ['Provider Portal', 'Partner Tools'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Privacy Policy'],
  },
];

const LandingHome = () => {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <nav className="fixed top-0 z-50 w-full border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="font-heading text-xl font-bold tracking-tighter text-slate-900"
          >
            Voyager AI
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#explore"
              className="font-heading text-sm font-semibold tracking-tight text-teal-600 transition-colors duration-300"
            >
              Explore
            </a>
            <a
              href="#itineraries"
              className="font-heading text-sm font-medium tracking-tight text-slate-600 transition-colors duration-300 hover:text-teal-500"
            >
              Itineraries
            </a>
            <a
              href="#providers"
              className="font-heading text-sm font-medium tracking-tight text-slate-600 transition-colors duration-300 hover:text-teal-500"
            >
              Providers
            </a>
            <a
              href="#support"
              className="font-heading text-sm font-medium tracking-tight text-slate-600 transition-colors duration-300 hover:text-teal-500"
            >
              Support
            </a>
          </div>

          <Link
            to="/signup"
            className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 font-heading text-sm font-semibold text-on-primary transition-all active:opacity-80"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <header className="relative flex min-h-[921px] items-center overflow-hidden pb-20 pt-32">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOeaU7jtsNUXmlsU5Cl8bCLtTZq06N6UY5__2bHqB22EvLolXcq1KF_OW-13DiMhoBcHybJ4G_goChKI2YONX8EAXDGYnb19GFv1rgmjNBGKpMxojrD2FlJxph-xMNyaHlKP42BbAG2hwYVj4blFt7zkvJpDJz7zaDldG-1J_kHEdvKxFq4rSSLM_Rj66w_5AXd4UYByhYmzPBa5PiVnPgz26SoLsbDxBLPlkgA17rBK97U7-eIWjsQPA-jqJx4FFt7EyoUBq4fg69"
            alt="Dragon Bridge Da Nang"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-2xl">
            <span className="mb-6 inline-block rounded-full bg-primary-container/10 px-4 py-1.5 font-heading text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Premium Discovery
            </span>
            <h1 className="mb-8 font-heading text-5xl leading-[1.1] font-extrabold tracking-tight text-on-surface md:text-7xl">
              Your Personal{' '}
              <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
                AI Concierge
              </span>{' '}
              for Da Nang
            </h1>

            <div className="max-w-xl rounded-[1.6rem] bg-surface-container-lowest p-2 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
              <div className="flex flex-col gap-2 md:flex-row">
                <div className="flex flex-1 items-center rounded-xl bg-surface-container-low px-4 py-3">
                  <span className="material-symbols-outlined mr-3 text-outline">
                    location_on
                  </span>
                  <input
                    type="text"
                    defaultValue="Da Nang, Vietnam"
                    placeholder="Where to?"
                    className="w-full border-none bg-transparent text-sm focus:ring-0 focus:outline-none"
                  />
                </div>
                <div className="flex flex-1 items-center rounded-xl bg-surface-container-low px-4 py-3">
                  <span className="material-symbols-outlined mr-3 text-outline">
                    calendar_month
                  </span>
                  <input
                    type="text"
                    placeholder="When?"
                    className="w-full border-none bg-transparent text-sm focus:ring-0 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="whitespace-nowrap rounded-xl bg-primary px-8 py-4 font-heading text-sm font-bold text-on-primary transition-all hover:opacity-90"
                >
                  Start Planning
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="explore" className="bg-surface py-24">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-3">
            {valueProps.map((item) => (
              <div key={item.title} className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-container text-primary">
                  <span className="material-symbols-outlined text-3xl">
                    {item.icon}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-on-surface">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="itineraries" className="overflow-hidden bg-surface-container-low py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <div className="space-y-8 lg:w-1/2">
              <h2 className="font-heading text-4xl leading-tight font-extrabold text-on-surface">
                Watch AI craft your <br />
                perfect Da Nang day.
              </h2>

              <div className="space-y-6">
                {steps.map((step) => (
                  <div key={step.number} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                      {step.number}
                    </span>
                    <div>
                      <h4 className="mb-1 font-bold text-on-surface">
                        {step.title}
                      </h4>
                      <p className="text-sm text-on-surface-variant">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:w-1/2">
              <div className="mx-auto max-w-md rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="material-symbols-outlined text-xl text-primary">
                        smart_toy
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">
                        VOYAGER AI
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
                        Active Assistant
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline">
                    more_vert
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl rounded-tl-none bg-surface-container p-4 text-sm text-on-surface">
                    Based on your love for photography, I&apos;ve added a
                    sunrise visit to Marble Mountains at 6:00 AM to catch the
                    best light. Would you like to book a local guide?
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-on-primary"
                    >
                      Yes, book guide
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-outline-variant px-4 py-2 text-xs font-bold text-on-surface-variant"
                    >
                      Show alternatives
                    </button>
                  </div>

                  <div className="border-t border-outline-variant/20 pt-4">
                    <p className="mb-3 text-[10px] font-bold text-on-surface-variant">
                      UPCOMING ITINERARY
                    </p>
                    <div className="flex items-center gap-4 rounded-xl bg-surface-container-low p-3">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfaUXoFBvgl5VK-76LRyFDkTUX1mEDkGC302TB6zrJ9jloVC5NXwDC4ZhkftT0lVK1zN9k1AT3_Ddh310Ae7pag0gg2ONl05LEjHvbI81ywAG23Ql8qag37Eo5zyztRKrCRs0oVhFKQZjASOLIOb85UHSDlKZtWPf1hECJSbFUt0kInwv2hOXT6vPFhUs45i5TMec7pg-HnZMECTrX_t67UbOS9EiKjDw25Z53i22-sxpLz5j22O4-902OFgCHvbzZo96zaxc6c7io"
                        alt="Golden Bridge hands at Ba Na Hills in Vietnam"
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold">
                          Ba Na Hills Excursion
                        </p>
                        <p className="text-[10px] text-on-surface-variant">
                          Starts at 09:30 AM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="mb-4 font-heading text-4xl font-extrabold text-on-surface">
                Da Nang Essentials
              </h2>
              <p className="text-on-surface-variant">
                Hand-picked experiences by our AI and local experts.
              </p>
            </div>

            <button
              type="button"
              className="group flex items-center gap-2 font-heading font-bold text-primary transition-all hover:gap-3"
            >
              View all destinations{' '}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {experiences.map((item) => (
              <article key={item.title} className="group cursor-pointer">
                <div className="relative mb-6 h-80 overflow-hidden rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {item.recommended ? (
                    <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-primary shadow-sm backdrop-blur">
                      AI Recommended
                    </div>
                  ) : null}
                </div>
                <h3 className="mb-2 font-heading text-xl font-bold text-on-surface">
                  {item.title}
                </h3>
                <p className="line-clamp-2 text-sm text-on-surface-variant">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="providers" className="bg-surface-container-low py-24">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {roles.map((role) => (
              <div
                key={role.title}
                className={`rounded-2xl p-10 shadow-[0_20px_40px_rgba(25,28,30,0.06)] ${role.className}`}
              >
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${role.iconWrapperClass}`}
                >
                  <span className="material-symbols-outlined">{role.icon}</span>
                </div>
                <h3 className="mb-4 font-heading text-2xl font-bold">
                  {role.title}
                </h3>
                <p className="mb-8 text-current/80">{role.description}</p>
                <button
                  type="button"
                  className="flex items-center gap-2 font-bold transition-transform hover:translate-x-1"
                >
                  {role.cta}
                  <span className="material-symbols-outlined">east</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-12 text-center md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className={stat.className}>
                <p className="mb-2 font-heading text-5xl font-extrabold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container mx-auto px-6">
          <h2 className="mb-16 text-center font-heading text-3xl font-bold">
            Loved by Travelers
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="relative rounded-2xl bg-surface-container-low p-8 italic text-on-surface-variant"
              >
                <span className="material-symbols-outlined absolute -left-2 -top-4 text-6xl text-primary/20">
                  format_quote
                </span>
                <p className="relative z-10 mb-6">{item.quote}</p>
                <div className="flex items-center gap-4 not-italic">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-300">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      {item.name}
                    </p>
                    <p className="text-xs">{item.country}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary to-primary-container p-12 text-center text-on-primary md:p-20">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtIIDw7y5vCwJ14FkPLHWXwxDyO1KDwOvbF5kjPe-gGe5jhdZ00W729Dj75g1ldvdFf58AXZGuTM7eeC2TsgCAGJ2-QN0S1XATFoHZyq06OfEsXZgffwUfIDcW_WamL77JRBwdw2_QpzCE7Mcn5gnwVr3jw09cFYOvNOxzE60e-sQEjFKznUnJ1qmHnE29VuVIU5DOYn_vmKUimXlMYnNeBzkCuec1mGXjr3MLLQbOgKmeQ4Xxmv228wPxJIm8UrNGNIh_wa5KEiCB"
              alt="Abstract aerial pattern of Marble Mountains in Da Nang"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="mb-8 font-heading text-4xl leading-tight font-extrabold md:text-5xl">
              Ready for your Da Nang adventure?
            </h2>
            <p className="mb-10 text-lg text-white/80">
              Create your AI plan for free and experience the coast of Vietnam
              like never before.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="rounded-full bg-surface-container-lowest px-10 py-4 font-heading text-lg font-bold text-primary transition-transform hover:scale-105"
              >
                Plan My Trip Now
              </Link>
              <button
                type="button"
                className="rounded-full border border-white/20 bg-white/10 px-10 py-4 font-heading text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                View Demo Itinerary
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer id="support" className="bg-slate-50 pb-10 pt-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 text-sm leading-relaxed md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="mb-4 block font-heading text-lg font-bold text-slate-900">
              Voyager AI
            </span>
            <p className="max-w-xs text-slate-500">
              Pioneering the future of editorial travel through intelligent AI
              orchestration.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 font-heading font-bold text-slate-900">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="transition-colors text-slate-500 hover:text-slate-900"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-slate-200 pt-10 text-center text-xs text-slate-400">
          © 2024 The Editorial Voyager. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingHome;
