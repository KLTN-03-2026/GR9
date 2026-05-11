import React from "react";

const ProviderAnalytics = () => {
    return (
        <div>
            <meta charSet="utf-8" />
            <meta
                content="width=device-width, initial-scale=1.0"
                name="viewport"
            />
            <title>Voyager AI | Provider Analytics</title>
            {/* Fonts & Icons */}
            <link href="https://fonts.googleapis.com" rel="preconnect" />
            <link
                crossOrigin
                href="https://fonts.gstatic.com"
                rel="preconnect"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
            <style
                dangerouslySetInnerHTML={{
                    __html: "\n        body { font-family: 'Inter', sans-serif; background-color: #f7f9fb; }\n        .font-plus-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }\n        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }\n        .glass-nav { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }\n        .no-scrollbar::-webkit-scrollbar { display: none; }\n    ",
                }}
            />
            {/* TopNavBar */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm font-['Plus_Jakarta_Sans'] antialiased">
                <div className="flex justify-between items-center px-6 py-3 w-full max-w-screen-2xl mx-auto">
                    <div className="flex items-center gap-8">
                        <span className="text-xl font-bold tracking-tight text-teal-900">
                            Voyager AI
                        </span>
                        <div className="hidden md:flex gap-6 items-center">
                            <a
                                className="text-slate-500 hover:text-teal-600 transition-all duration-300"
                                href="#"
                            >
                                Dashboard
                            </a>
                            <a
                                className="text-slate-500 hover:text-teal-600 transition-all duration-300"
                                href="#"
                            >
                                Tours
                            </a>
                            <a
                                className="text-teal-600 font-semibold border-b-2 border-teal-600 py-1 transition-all duration-300"
                                href="#"
                            >
                                Analytics
                            </a>
                            <a
                                className="text-slate-500 hover:text-teal-600 transition-all duration-300"
                                href="#"
                            >
                                Guides
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="material-symbols-outlined p-2 text-slate-500 hover:bg-teal-50/50 rounded-full transition-all duration-300 active:scale-95">
                            notifications
                        </button>
                        <button className="material-symbols-outlined p-2 text-slate-500 hover:bg-teal-50/50 rounded-full transition-all duration-300 active:scale-95">
                            settings
                        </button>
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border-2 border-primary-fixed">
                            <img
                                alt="User profile avatar"
                                data-alt="A professional headshot of a travel operations manager smiling warmly. The person has a clean-cut appearance and is wearing a high-end, minimalist navy blazer. The background is a blurred high-rise office with large windows overlooking a modern coastal city at golden hour, maintaining a premium corporate travel aesthetic."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHaYlqnrZag19KFfS9PuAQg-7LtWsFVUqPt-3eu3gvWfVS1ZGXLVZTVxYMSt4-1OEbREemmvBqxetrPBCP0LiPP-9QIBFMVkpUR6gIqCZqFOMl970Xook0SeR3Bfcai6DCoUD2lzYkI9LChxvQZV8RYW9RbwibFEJ3ZeGGgnXvFzRXVF_G1Zis_OUcZXI8AyK3ZQV9MYXHmaInyJ4YO45OHO7MoQuZzkFjVKgWXr_bWyXan-8NE2tarWO7v7J8aim1kRGXYkJNyxV1"
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-slate-100/50 h-px" />
            </nav>
            <div className="flex pt-16 min-h-screen">
                {/* SideNavBar (Provider version) */}
                <aside className="h-screen w-64 hidden lg:flex flex-col bg-slate-50 border-r border-slate-200/50 sticky top-16">
                    <div className="flex flex-col gap-2 p-4 text-sm font-medium font-['Plus_Jakarta_Sans']">
                        <div className="px-2 py-4 mb-2">
                            <h2 className="text-lg font-extrabold text-slate-900">
                                Travel Hub
                            </h2>
                            <p className="text-xs text-on-surface-variant font-normal">
                                Enterprise Tier
                            </p>
                        </div>
                        {/* Navigation Tabs */}
                        <a className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-xl hover:translate-x-1 transition-transform duration-200 cursor-pointer select-none">
                            <span className="material-symbols-outlined">
                                grid_view
                            </span>
                            Fleet Overview
                        </a>
                        <a className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-xl hover:translate-x-1 transition-transform duration-200 cursor-pointer select-none">
                            <span className="material-symbols-outlined">
                                badge
                            </span>
                            Guide Management
                        </a>
                        <a className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-xl hover:translate-x-1 transition-transform duration-200 cursor-pointer select-none">
                            <span className="material-symbols-outlined">
                                distance
                            </span>
                            Live Tracking
                        </a>
                        {/* Active Item */}
                        <a className="flex items-center gap-3 p-3 bg-teal-50 text-teal-700 rounded-xl cursor-pointer select-none">
                            <span
                                className="material-symbols-outlined"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                payments
                            </span>
                            Revenue
                        </a>
                        <a className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-xl hover:translate-x-1 transition-transform duration-200 cursor-pointer select-none">
                            <span className="material-symbols-outlined">
                                help_center
                            </span>
                            Support
                        </a>
                        <div className="mt-auto pt-6">
                            <button className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                                <span className="material-symbols-outlined">
                                    add
                                </span>
                                Create New Tour
                            </button>
                        </div>
                    </div>
                </aside>
                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
                    {/* Header Section */}
                    <header className="mb-10">
                        <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-2">
                            Performance Analytics
                        </h1>
                        <p className="text-on-surface-variant text-lg max-w-2xl">
                            Insight-driven data for your travel operations.
                            Tracking growth and passenger satisfaction across
                            all seasonal routes.
                        </p>
                    </header>
                    {/* KPI Overview Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {/* Total Revenue */}
                        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-label-md text-on-surface-variant font-medium mb-1">
                                    Total Revenue
                                </p>
                                <h3 className="text-2xl font-bold font-headline text-on-surface">
                                    $124,592.00
                                </h3>
                                <div className="mt-4 flex items-center gap-1 text-teal-600 text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">
                                        trending_up
                                    </span>
                                    +12.5% from last month
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <span
                                    className="material-symbols-outlined text-8xl"
                                    style={{
                                        fontVariationSettings: '"FILL" 1',
                                    }}
                                >
                                    payments
                                </span>
                            </div>
                        </div>
                        {/* Active Bookings */}
                        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-label-md text-on-surface-variant font-medium mb-1">
                                    Active Bookings
                                </p>
                                <h3 className="text-2xl font-bold font-headline text-on-surface">
                                    1,284
                                </h3>
                                <div className="mt-4 flex items-center gap-1 text-teal-600 text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">
                                        trending_up
                                    </span>
                                    +4.2% daily average
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <span
                                    className="material-symbols-outlined text-8xl"
                                    style={{
                                        fontVariationSettings: '"FILL" 1',
                                    }}
                                >
                                    confirmation_number
                                </span>
                            </div>
                        </div>
                        {/* Average Rating */}
                        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-label-md text-on-surface-variant font-medium mb-1">
                                    Average Rating
                                </p>
                                <h3 className="text-2xl font-bold font-headline text-on-surface">
                                    4.9 / 5.0
                                </h3>
                                <div className="mt-4 flex items-center gap-1 text-tertiary text-xs font-bold">
                                    <span
                                        className="material-symbols-outlined text-sm"
                                        style={{
                                            fontVariationSettings: '"FILL" 1',
                                        }}
                                    >
                                        stars
                                    </span>
                                    Top 5% of providers
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <span
                                    className="material-symbols-outlined text-8xl"
                                    style={{
                                        fontVariationSettings: '"FILL" 1',
                                    }}
                                >
                                    star
                                </span>
                            </div>
                        </div>
                        {/* Completion Rate */}
                        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-label-md text-on-surface-variant font-medium mb-1">
                                    Tour Success Rate
                                </p>
                                <h3 className="text-2xl font-bold font-headline text-on-surface">
                                    99.4%
                                </h3>
                                <div className="mt-4 flex items-center gap-1 text-secondary text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">
                                        check_circle
                                    </span>
                                    Stable performance
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <span
                                    className="material-symbols-outlined text-8xl"
                                    style={{
                                        fontVariationSettings: '"FILL" 1',
                                    }}
                                >
                                    verified
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Main Charts & Bento Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                        {/* Revenue Trends Chart (2/3 width) */}
                        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-3xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-xl font-bold font-headline text-on-surface">
                                        Revenue Trends
                                    </h2>
                                    <p className="text-on-surface-variant text-sm mt-1">
                                        Monthly earnings across all active
                                        regions.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-xs font-bold text-primary bg-teal-50 rounded-full">
                                        Monthly
                                    </button>
                                    <button className="px-3 py-1 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
                                        Quarterly
                                    </button>
                                </div>
                            </div>
                            {/* Mock Chart Visualization */}
                            <div className="h-64 flex items-end justify-between gap-2 px-2 border-b border-outline-variant/20">
                                <div
                                    className="w-full bg-teal-50 group relative cursor-pointer"
                                    style={{ height: "40%" }}
                                >
                                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-t-lg" />
                                </div>
                                <div
                                    className="w-full bg-teal-50 group relative cursor-pointer"
                                    style={{ height: "55%" }}
                                >
                                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-t-lg" />
                                </div>
                                <div
                                    className="w-full bg-teal-50 group relative cursor-pointer"
                                    style={{ height: "45%" }}
                                >
                                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-t-lg" />
                                </div>
                                <div
                                    className="w-full bg-primary-container group relative cursor-pointer"
                                    style={{ height: "75%" }}
                                >
                                    <div className="absolute inset-0 bg-primary opacity-100 transition-all duration-300 rounded-t-lg" />
                                </div>
                                <div
                                    className="w-full bg-teal-50 group relative cursor-pointer"
                                    style={{ height: "60%" }}
                                >
                                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-t-lg" />
                                </div>
                                <div
                                    className="w-full bg-teal-50 group relative cursor-pointer"
                                    style={{ height: "85%" }}
                                >
                                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-t-lg" />
                                </div>
                                <div
                                    className="w-full bg-teal-50 group relative cursor-pointer"
                                    style={{ height: "70%" }}
                                >
                                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-t-lg" />
                                </div>
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>
                                <span>Jul</span>
                            </div>
                        </div>
                        {/* Traveler Demographics */}
                        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] flex flex-col">
                            <h2 className="text-xl font-bold font-headline text-on-surface mb-1">
                                Traveler Origin
                            </h2>
                            <p className="text-on-surface-variant text-sm mb-8">
                                Demographic breakdown of primary visitors.
                            </p>
                            <div className="flex-1 flex flex-col justify-center gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-on-surface">
                                                Europe
                                            </span>
                                            <span className="text-primary">
                                                45%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full"
                                                style={{ width: "45%" }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-on-surface">
                                                North America
                                            </span>
                                            <span className="text-primary">
                                                32%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary-container h-full rounded-full"
                                                style={{ width: "32%" }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-on-surface">
                                                Asia Pacific
                                            </span>
                                            <span className="text-primary">
                                                18%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                            <div
                                                className="bg-teal-200 h-full rounded-full"
                                                style={{ width: "18%" }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-on-surface">
                                                Other
                                            </span>
                                            <span className="text-primary">
                                                5%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                            <div
                                                className="bg-outline-variant h-full rounded-full"
                                                style={{ width: "5%" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24 lg:pb-0">
                        {/* Top Performing Tours */}
                        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold font-headline text-on-surface">
                                    Top Performing Tours
                                </h2>
                                <button className="text-primary text-sm font-bold flex items-center hover:underline">
                                    View All
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                                        <img
                                            alt="Azure Coast Expedition"
                                            data-alt="An editorial travel photography shot of a luxury yacht gliding through crystal-clear turquoise waters along the French Riviera. The lighting is bright and warm, reflecting off the gentle ocean waves. The overall aesthetic is expensive and serene, focusing on premium leisure and coastal beauty."
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRfpthN9lhSc3P8MPRA0GVuFKqyUk-62-kUAdFoUmobTGc4g664GPvHWlgxspD3XjG33Ad4DXYUDXQdJsIDUpNI_fBIwSwaAHEajjWMjD8aBtOv4x7KR3KzKg8wg6PP4dEueHsWxqqZvnDvWqv19pji2pgcaMb-Bd6xFJXLbmz8lzQNqRe_vUqpVDFg8EKpHYXBySGgs3rf8uodc21vMBmxDvJookSnl0lBQ3xznQUlwNKKlFqmr6UDAXNauTVgKSBqq7HOkQKhccg"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-on-surface">
                                            Azure Coast Expedition
                                        </h4>
                                        <p className="text-xs text-on-surface-variant">
                                            42 bookings this week
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-on-surface">
                                            $24,400
                                        </p>
                                        <span className="text-[10px] uppercase tracking-tighter text-teal-600 font-bold">
                                            +18% growth
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                                        <img
                                            alt="Nordic Aurora Safari"
                                            data-alt="A cinematic nighttime shot of the Northern Lights dancing over a snow-covered Scandinavian forest and a cozy glass igloo. The palette is deep midnight blues and vibrant lime greens. The atmosphere is quiet, majestic, and high-end, representing an exclusive adventure experience."
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdWDiDP1hZUwwqGNCQzOnycuA5LG9VpOvWQh3Cpgk3VGEIanFs2JFlTlAYzOBWkH06ny9lB2n6RqsamSUdRg_oAFtXuH78ICam6iTdoNtYzeIBaL7155wxIX1GVrLqj9HPuCUUM4eLTaGUHvP_ZpjFq33rYkOoYJvk16H5EjpKew6GQ0PIz-pNy21KykLVVG9LcAYYYPzupzmcMAweSXvs2sXipjmSabLMlRKzBef4LSQuKaKQDWI6W7_w1rlpF-TbYeD4wNGCr6Zg"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-on-surface">
                                            Nordic Aurora Safari
                                        </h4>
                                        <p className="text-xs text-on-surface-variant">
                                            28 bookings this week
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-on-surface">
                                            $19,820
                                        </p>
                                        <span className="text-[10px] uppercase tracking-tighter text-teal-600 font-bold">
                                            +5% growth
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                                        <img
                                            alt="Athenian Mythos Trail"
                                            data-alt="A soft-focus architectural shot of the Parthenon in Athens during the golden hour. The ancient marble columns are bathed in warm orange sunlight against a pale blue sky. The composition is clean and minimalist, highlighting historical grandeur and sophisticated cultural travel."
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2vg_50vh5mb0PxALW2mLZ6Cb8JM3x1rEmXhX2oC_I2Z6WgW3jno6rWmW3TLSdrfQRn2wd5nad0H3MgW0CMOXEHuJsoFFcNc-GsEJlEMA1ImQPYJnLg-NZjJ8YrEgxNc2XqKQ4VRWDOYLFDxD1aIsn0FjgF5jQjZ-q_20WtZ4HHDMGAf0o8fBUHhysByefhDbnrXND0yyaJLOFqaV5TngBWYn6FMI75NjtBwHa5vQ8hPzMrmOLEbb6LieyZGdlOIotkSqrSFR5cjCu"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-on-surface">
                                            Athenian Mythos Trail
                                        </h4>
                                        <p className="text-xs text-on-surface-variant">
                                            15 bookings this week
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-on-surface">
                                            $12,150
                                        </p>
                                        <span className="text-[10px] uppercase tracking-tighter text-error font-bold">
                                            -2% decline
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Recent Reviews Summary */}
                        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
                            <h2 className="text-xl font-bold font-headline text-on-surface mb-1">
                                Recent Reviews
                            </h2>
                            <p className="text-on-surface-variant text-sm mb-8">
                                What your travelers are saying globally.
                            </p>
                            <div className="space-y-6">
                                <div className="bg-surface p-4 rounded-2xl relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary-fixed-dim" />
                                            <span className="text-xs font-bold text-on-surface">
                                                Elena S.
                                            </span>
                                        </div>
                                        <div className="flex text-primary text-xs">
                                            <span
                                                className="material-symbols-outlined text-sm"
                                                style={{
                                                    fontVariationSettings:
                                                        '"FILL" 1',
                                                }}
                                            >
                                                star
                                            </span>
                                            <span
                                                className="material-symbols-outlined text-sm"
                                                style={{
                                                    fontVariationSettings:
                                                        '"FILL" 1',
                                                }}
                                            >
                                                star
                                            </span>
                                            <span
                                                className="material-symbols-outlined text-sm"
                                                style={{
                                                    fontVariationSettings:
                                                        '"FILL" 1',
                                                }}
                                            >
                                                star
                                            </span>
                                            <span
                                                className="material-symbols-outlined text-sm"
                                                style={{
                                                    fontVariationSettings:
                                                        '"FILL" 1',
                                                }}
                                            >
                                                star
                                            </span>
                                            <span
                                                className="material-symbols-outlined text-sm"
                                                style={{
                                                    fontVariationSettings:
                                                        '"FILL" 1',
                                                }}
                                            >
                                                star
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-on-surface-variant italic leading-relaxed">
                                        "The logistics were seamless. Our guide
                                        in Santorini was incredibly
                                        knowledgeable about the local hidden
                                        gems..."
                                    </p>
                                </div>
                                <div className="bg-surface p-4 rounded-2xl relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-secondary-fixed" />
                                            <span className="text-xs font-bold text-on-surface">
                                                Mark J.
                                            </span>
                                        </div>
                                        <div className="flex text-primary text-xs">
                                            <span
                                                className="material-symbols-outlined text-sm"
                                                style={{
                                                    fontVariationSettings:
                                                        '"FILL" 1',
                                                }}
                                            >
                                                star
                                            </span>
                                            <span
                                                className="material-symbols-outlined text-sm"
                                                style={{
                                                    fontVariationSettings:
                                                        '"FILL" 1',
                                                }}
                                            >
                                                star
                                            </span>
                                            <span
                                                className="material-symbols-outlined text-sm"
                                                style={{
                                                    fontVariationSettings:
                                                        '"FILL" 1',
                                                }}
                                            >
                                                star
                                            </span>
                                            <span
                                                className="material-symbols-outlined text-sm"
                                                style={{
                                                    fontVariationSettings:
                                                        '"FILL" 1',
                                                }}
                                            >
                                                star
                                            </span>
                                            <span
                                                className="material-symbols-outlined text-sm"
                                                style={{
                                                    fontVariationSettings:
                                                        '"FILL" 0',
                                                }}
                                            >
                                                star
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-on-surface-variant italic leading-relaxed">
                                        "Great value for money, but the
                                        departure time was a bit early for my
                                        family's preference."
                                    </p>
                                </div>
                            </div>
                            <button className="w-full mt-6 py-3 border border-outline-variant/30 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
                                Manage All Reviews
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            {/* BottomNavBar (Mobile Only) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-white/80 backdrop-blur-lg flex justify-around items-center px-6 pb-safe z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <a
                    className="flex flex-col items-center justify-center text-slate-400"
                    href="#"
                >
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                        Home
                    </span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-slate-400"
                    href="#"
                >
                    <span className="material-symbols-outlined">explore</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                        My Tours
                    </span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-teal-600 bg-teal-50/50 rounded-2xl px-4 py-1"
                    href="#"
                >
                    <span className="material-symbols-outlined">near_me</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                        Map
                    </span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-slate-400"
                    href="#"
                >
                    <span className="material-symbols-outlined">
                        account_circle
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                        Profile
                    </span>
                </a>
            </nav>
        </div>
    );
};

export default ProviderAnalytics;
