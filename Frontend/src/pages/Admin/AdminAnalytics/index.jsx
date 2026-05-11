import React from "react";

const AdminAnalytics = () => {
    return (
        <div>
            <meta charSet="utf-8" />
            <meta
                content="width=device-width, initial-scale=1.0"
                name="viewport"
            />
            <title>Admin Console | The Editorial Voyager</title>
            <link
                href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
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
                    __html: "\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n        .tonal-transition {\n            background: linear-gradient(to bottom, transparent, rgba(242, 244, 246, 0.5));\n        }\n        body {\n            font-family: 'Inter', sans-serif;\n            background-color: #f7f9fb;\n        }\n        h1, h2, h3, .brand-font {\n            font-family: 'Plus Jakarta Sans', sans-serif;\n        }\n        .glass-nav {\n            backdrop-filter: blur(12px);\n            -webkit-backdrop-filter: blur(12px);\n        }\n    ",
                }}
            />
            {/* SideNavBar (Admin Version) */}
            <aside className="fixed left-0 top-0 hidden md:flex flex-col h-screen w-64 bg-slate-50 dark:bg-slate-950 font-['Inter'] text-sm tracking-wide z-50">
                <div className="px-8 py-10">
                    <h2 className="text-lg font-black text-teal-700 dark:text-teal-500 uppercase tracking-tighter">
                        Admin Console
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        Verification Authority
                    </p>
                </div>
                <nav className="flex-1 space-y-1">
                    {/* Dashboard Active */}
                    <a
                        className="flex items-center bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 font-bold rounded-l-full ml-4 pl-4 py-3 transition-transform duration-200"
                        href="#"
                    >
                        <span className="material-symbols-outlined mr-3">
                            dashboard
                        </span>
                        <span>Dashboard</span>
                    </a>
                    <a
                        className="flex items-center text-slate-600 dark:text-slate-400 pl-8 py-3 hover:text-teal-600 dark:hover:text-teal-300 hover:translate-x-1 transition-transform duration-200"
                        href="#"
                    >
                        <span className="material-symbols-outlined mr-3">
                            fact_check
                        </span>
                        <span>Verification Queue</span>
                    </a>
                    <a
                        className="flex items-center text-slate-600 dark:text-slate-400 pl-8 py-3 hover:text-teal-600 dark:hover:text-teal-300 hover:translate-x-1 transition-transform duration-200"
                        href="#"
                    >
                        <span className="material-symbols-outlined mr-3">
                            article
                        </span>
                        <span>License Review</span>
                    </a>
                    <a
                        className="flex items-center text-slate-600 dark:text-slate-400 pl-8 py-3 hover:text-teal-600 dark:hover:text-teal-300 hover:translate-x-1 transition-transform duration-200"
                        href="#"
                    >
                        <span className="material-symbols-outlined mr-3">
                            group
                        </span>
                        <span>User Management</span>
                    </a>
                    <a
                        className="flex items-center text-slate-600 dark:text-slate-400 pl-8 py-3 hover:text-teal-600 dark:hover:text-teal-300 hover:translate-x-1 transition-transform duration-200"
                        href="#"
                    >
                        <span className="material-symbols-outlined mr-3">
                            history
                        </span>
                        <span>System Logs</span>
                    </a>
                </nav>
                <div className="p-6">
                    <button className="w-full bg-gradient-to-br from-primary to-primary-container text-white rounded-xl py-3 px-4 font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200">
                        New Policy
                    </button>
                </div>
                <footer className="mt-auto pb-8 space-y-1">
                    <a
                        className="flex items-center text-slate-600 dark:text-slate-400 pl-8 py-2 hover:text-teal-600"
                        href="#"
                    >
                        <span className="material-symbols-outlined mr-3">
                            settings
                        </span>
                        <span>Settings</span>
                    </a>
                    <a
                        className="flex items-center text-slate-600 dark:text-slate-400 pl-8 py-2 hover:text-teal-600"
                        href="#"
                    >
                        <span className="material-symbols-outlined mr-3">
                            contact_support
                        </span>
                        <span>Support</span>
                    </a>
                </footer>
            </aside>
            {/* Main Content Canvas */}
            <main className="md:ml-64 min-h-screen">
                {/* TopNavBar */}
                <header className="fixed top-0 right-0 left-0 md:left-64 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white brand-font">
                            The Editorial Voyager
                        </span>
                        <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/20">
                            <span className="material-symbols-outlined text-slate-400 text-sm mr-2">
                                search
                            </span>
                            <input
                                className="bg-transparent border-none focus:ring-0 text-sm text-on-surface w-64"
                                placeholder="Search system nodes..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all duration-200">
                            <span className="material-symbols-outlined">
                                notifications
                            </span>
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all duration-200">
                            <span className="material-symbols-outlined">
                                help
                            </span>
                        </button>
                        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20">
                            <img
                                alt="Administrator profile avatar"
                                data-alt="Professional portrait of a high-level system administrator in a modern office environment. The image features soft, high-key natural lighting, emphasizing a clean, professional aesthetic. The subject has a confident expression, suited for a luxury editorial travel brand's leadership profile. Subtle teal and white tones dominate the background to match the platform's visual identity."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxs6SBgpeXxGPWY5G3O_jO8vAHm_48cdyK8Q3Td3YvxxwLDnYX4pivBbcx959zeisKvqo77NyJdCV4-OOAG7U7-SUYHFKuV3LzbLUK15ETnb6-wFPzIWt66zyWex0jzckQez_nnWNbkt55gvS5qoBShk0zOQJ98GT-HAWNHWsVCm_vnYr6V6xxWexq2i3isV4_e2Wm46kFFaGay15p0A2fZY3JZPcgMvigIckBcW4fKw8rcC5P6M3Ff2xxRASmTSya21OZkWZg5CaX"
                            />
                        </div>
                    </div>
                </header>
                {/* Canvas Content */}
                <div className="pt-24 px-8 pb-12">
                    {/* Hero Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
                            System Governance
                        </h1>
                        <p className="text-on-surface-variant text-lg">
                            Real-time platform performance and compliance
                            overview.
                        </p>
                    </div>
                    {/* KPI Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {/* KPI Card 1 */}
                        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="p-3 bg-secondary-container rounded-xl text-on-secondary-container">
                                        <span className="material-symbols-outlined">
                                            payments
                                        </span>
                                    </span>
                                    <span className="text-xs font-bold text-primary flex items-center">
                                        <span className="material-symbols-outlined text-xs mr-1">
                                            trending_up
                                        </span>{" "}
                                        +12.5%
                                    </span>
                                </div>
                                <h3 className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider mb-1">
                                    Total Platform GMV
                                </h3>
                                <p className="text-2xl font-bold text-on-surface">
                                    $2,840,192.00
                                </p>
                            </div>
                        </div>
                        {/* KPI Card 2 */}
                        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="p-3 bg-primary-container/10 rounded-xl text-primary">
                                        <span className="material-symbols-outlined">
                                            travel_explore
                                        </span>
                                    </span>
                                    <span className="text-xs font-bold text-primary flex items-center">
                                        <span className="material-symbols-outlined text-xs mr-1">
                                            person_add
                                        </span>{" "}
                                        842 New
                                    </span>
                                </div>
                                <h3 className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider mb-1">
                                    Active Travelers
                                </h3>
                                <p className="text-2xl font-bold text-on-surface">
                                    14,209
                                </p>
                            </div>
                        </div>
                        {/* KPI Card 3 */}
                        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="p-3 bg-tertiary-container/10 rounded-xl text-tertiary">
                                        <span className="material-symbols-outlined">
                                            verified_user
                                        </span>
                                    </span>
                                    <span className="text-xs font-bold text-on-tertiary-fixed-variant">
                                        98% Verified
                                    </span>
                                </div>
                                <h3 className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider mb-1">
                                    Verified Providers
                                </h3>
                                <p className="text-2xl font-bold text-on-surface">
                                    1,124
                                </p>
                            </div>
                        </div>
                        {/* KPI Card 4 */}
                        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="p-3 bg-teal-50 rounded-xl text-teal-600">
                                        <span className="material-symbols-outlined">
                                            health_and_safety
                                        </span>
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                                        Operational
                                    </span>
                                </div>
                                <h3 className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider mb-1">
                                    System Health
                                </h3>
                                <p className="text-2xl font-bold text-on-surface">
                                    99.98%{" "}
                                    <span className="text-sm font-normal text-on-surface-variant">
                                        Uptime
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Main Analytics Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Growth Chart Area */}
                        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-8 shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">
                                        Growth Metrics
                                    </h2>
                                    <p className="text-on-surface-variant text-sm italic">
                                        Traveler vs. Provider Acquisition (Last
                                        30 Days)
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="px-4 py-2 bg-surface-container-low rounded-lg text-xs font-bold text-on-surface-variant">
                                        Daily
                                    </button>
                                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-md">
                                        Weekly
                                    </button>
                                </div>
                            </div>
                            {/* Faux Chart Implementation using CSS Grids/Bars */}
                            <div className="h-64 flex items-end justify-between space-x-2 pb-6 border-b border-outline-variant/10">
                                <div className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div className="w-full bg-secondary-fixed h-[40%] rounded-t-lg relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            420
                                        </div>
                                    </div>
                                    <div className="w-full bg-primary-container h-[60%] rounded-t-lg relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            680
                                        </div>
                                    </div>
                                    <span className="text-[10px] mt-2 font-bold text-slate-400">
                                        Week 1
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div className="w-full bg-secondary-fixed h-[35%] rounded-t-lg" />
                                    <div className="w-full bg-primary-container h-[75%] rounded-t-lg" />
                                    <span className="text-[10px] mt-2 font-bold text-slate-400">
                                        Week 2
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div className="w-full bg-secondary-fixed h-[45%] rounded-t-lg" />
                                    <div className="w-full bg-primary-container h-[65%] rounded-t-lg" />
                                    <span className="text-[10px] mt-2 font-bold text-slate-400">
                                        Week 3
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div className="w-full bg-secondary-fixed h-[50%] rounded-t-lg" />
                                    <div className="w-full bg-primary-container h-[85%] rounded-t-lg" />
                                    <span className="text-[10px] mt-2 font-bold text-slate-400">
                                        Week 4
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div className="w-full bg-secondary-fixed h-[30%] rounded-t-lg" />
                                    <div className="w-full bg-primary-container h-[90%] rounded-t-lg" />
                                    <span className="text-[10px] mt-2 font-bold text-slate-400">
                                        Current
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-center space-x-6 mt-6">
                                <div className="flex items-center text-xs text-on-surface-variant font-medium">
                                    <div className="w-3 h-3 bg-primary-container rounded-full mr-2" />{" "}
                                    Travelers
                                </div>
                                <div className="flex items-center text-xs text-on-surface-variant font-medium">
                                    <div className="w-3 h-3 bg-secondary-fixed rounded-full mr-2" />{" "}
                                    Providers
                                </div>
                            </div>
                        </div>
                        {/* Geographic Distribution / Map */}
                        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-8 shadow-[0px_20px_40px_rgba(25,28,30,0.06)] relative overflow-hidden">
                            <h2 className="text-xl font-bold mb-4">
                                Node Distribution
                            </h2>
                            <div className="mb-6">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="font-bold">
                                        Da Nang Hub
                                    </span>
                                    <span className="text-primary font-bold">
                                        42%
                                    </span>
                                </div>
                                <div className="w-full bg-surface-container rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{ width: "42%" }}
                                    />
                                </div>
                            </div>
                            <div className="h-48 w-full rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/20 mb-4">
                                <img
                                    className="w-full h-full object-cover grayscale opacity-60 mix-blend-multiply"
                                    data-alt="A stylized, minimalist map visualization of Da Nang, Vietnam, using a clean topographic style. The map features elegant teal circular markers representing active travel nodes and data centers. The lighting is bright and ethereal, consistent with a high-end travel dashboard's aesthetic, emphasizing connectivity and geographic coverage within the platform's core region."
                                    data-location="Da Nang"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXgrUHNPId4vscG6aOKKlzZ1x_dhP3B1Zm9mdoWtD4fhWfev7AL0CTRMwTVTU5GZZn2Nvto-kKoeUgir5E0SSdHE3LGtbq_2QhmkUIiCMJYmKWVZJkflA72SS75pApm9M528nsJsMYBrRyQD7UXztnJsWdbtWc48r2PI81CjoQy8dW_M8Ms9jJVWu5EL2npv28V4x9Iyy8f5Qa8JQ21a9Tnr_r2a0PyBJ45W2r9zSa1evLSUACHybJwnHH2BdNSTGt1Jp-MK5ZpkT5"
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-outline-variant/10">
                                    <span className="text-sm font-medium">
                                        Linh Ung Node
                                    </span>
                                    <span className="text-xs font-bold text-green-600">
                                        Active
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-outline-variant/10">
                                    <span className="text-sm font-medium">
                                        Marble Mtn. Hub
                                    </span>
                                    <span className="text-xs font-bold text-green-600">
                                        Active
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium">
                                        Hoi An Expansion
                                    </span>
                                    <span className="text-xs font-bold text-tertiary">
                                        Pending
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Verification Queue (Asymmetric Layout) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">
                                        Verification Queue
                                    </h2>
                                    <a
                                        className="text-sm font-bold text-primary hover:underline"
                                        href="#"
                                    >
                                        View All (42)
                                    </a>
                                </div>
                                <div className="space-y-4">
                                    {/* Queue Item 1 */}
                                    <div className="flex items-center p-4 bg-surface rounded-xl hover:bg-slate-50 transition-colors">
                                        <img
                                            className="w-12 h-12 rounded-lg object-cover mr-4"
                                            data-alt="A detailed, close-up photograph of a professional business license document with a premium gold seal and elegant typography, resting on a textured dark leather surface. The lighting is focused and warm, creating a sense of authenticity and high-stakes administrative review. The visual style is editorial and sophisticated, suitable for a travel platform's verification dashboard."
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl990UuQJzGZSq6i7NMeBju0wdKYUauhcTEQ2UC8ZU9BmlNLbhBtwafpsTyd0pm9rGsh1s4J6__STk9-qnll9cgTZQXli0S8oJJAIVoqEFiKCnJCGdZ-92qAtH_1Gd9lSby6bHoxlLwVQM8K8S7X0mhzMKOX1vw284jyaPaZahMK-Le0rqahOgl7UtBpku-J-XlD-vZ95GdEjaBVbwi361Tb-mZOlHhjAcnMiWPCvtUABmZWxHZyBXDP3_6hFpkVPSJj8tabI8i6BA"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold">
                                                Azure Bay Resorts
                                            </h4>
                                            <p className="text-xs text-on-surface-variant italic">
                                                Hospitality License - Da Nang
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-slate-400 mb-1">
                                                Submitted 2h ago
                                            </div>
                                            <button className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                    {/* Queue Item 2 */}
                                    <div className="flex items-center p-4 bg-surface rounded-xl hover:bg-slate-50 transition-colors">
                                        <img
                                            className="w-12 h-12 rounded-lg object-cover mr-4"
                                            data-alt="A professional tourism operator certificate displayed against a backdrop of travel gear like a compass and high-end leather bag. The lighting is cinematic with soft depth of field, reflecting a mood of adventure and reliability. The overall aesthetic is professional yet inviting, using a palette of earthy tones and teal accents to align with the platform's brand."
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2c8Q6jrjUvIduOiGa6OX8E43UE1RoglEHY7d5aaVWPne8OkxSVfy2BKDT9srhpHjsqqymybkPgq9ABJfFQrS2Fj8rXC0M3r7UnXVB6efWEvrhhN-DtvApJUaYAkeadvzBbExMXWLyg-liHvmr7aNDqT1N3fba7wUJy0tZRtzb9JydLDQqsogQkGOZ2UyBmeqMJw20QMwZ0xdlF1ftjW50CpG-sUmwodiDNzmT0z4UX3TUBcD6XI70cGPOVlQrslG3hJEqBjsRUxHE"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold">
                                                Mekong Delta Tours
                                            </h4>
                                            <p className="text-xs text-on-surface-variant italic">
                                                Guide Certification - Can Tho
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-slate-400 mb-1">
                                                Submitted 5h ago
                                            </div>
                                            <button className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* System Alerts Log */}
                        <div className="lg:col-span-5 bg-surface-container-high rounded-2xl p-8 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <span className="material-symbols-outlined text-8xl">
                                    priority_high
                                </span>
                            </div>
                            <h2 className="text-xl font-bold mb-6">
                                System Alerts
                            </h2>
                            <div className="space-y-4 relative z-10">
                                <div className="flex space-x-4 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
                                    <span className="material-symbols-outlined text-error mt-1">
                                        warning
                                    </span>
                                    <div>
                                        <h4 className="text-sm font-bold text-on-surface">
                                            API Rate Limit Warning
                                        </h4>
                                        <p className="text-xs text-on-surface-variant leading-relaxed">
                                            Node-42 (Marble Mtn) experiencing
                                            92% bandwidth utilization. Potential
                                            latency for traveler bookings.
                                        </p>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase mt-2 block">
                                            12 Minutes Ago
                                        </span>
                                    </div>
                                </div>
                                <div className="flex space-x-4 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
                                    <span className="material-symbols-outlined text-primary mt-1">
                                        info
                                    </span>
                                    <div>
                                        <h4 className="text-sm font-bold text-on-surface">
                                            New Policy Deployment
                                        </h4>
                                        <p className="text-xs text-on-surface-variant leading-relaxed">
                                            GDPR Compliance layer v2.4
                                            successfully propagated across all
                                            Southeast Asian nodes.
                                        </p>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase mt-2 block">
                                            1 Hour Ago
                                        </span>
                                    </div>
                                </div>
                                <div className="flex space-x-4 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
                                    <span className="material-symbols-outlined text-tertiary mt-1">
                                        security
                                    </span>
                                    <div>
                                        <h4 className="text-sm font-bold text-on-surface">
                                            Suspicious Activity Logged
                                        </h4>
                                        <p className="text-xs text-on-surface-variant leading-relaxed">
                                            Account 'Traveler_88' flagged for
                                            multiple rapid geofence violations
                                            in Central Da Nang.
                                        </p>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase mt-2 block">
                                            3 Hours Ago
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="mt-6 w-full py-3 border border-outline text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-white/20 transition-all">
                                Download Audit Log
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            {/* Mobile Bottom Navigation Shell */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center pb-6 pt-3 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 rounded-t-[1.5rem] shadow-[0px_-10px_30px_rgba(0,0,0,0.04)]">
                <a
                    className="flex flex-col items-center justify-center bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-2xl px-6 py-2 transition-all duration-200"
                    href="#"
                >
                    <span className="material-symbols-outlined">edit_note</span>
                    <span className="font-['Inter'] text-[10px] font-semibold uppercase tracking-widest mt-1">
                        Application
                    </span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-teal-500"
                    href="#"
                >
                    <span className="material-symbols-outlined">
                        pending_actions
                    </span>
                    <span className="font-['Inter'] text-[10px] font-semibold uppercase tracking-widest mt-1">
                        Tracking
                    </span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-teal-500"
                    href="#"
                >
                    <span className="material-symbols-outlined">
                        folder_shared
                    </span>
                    <span className="font-['Inter'] text-[10px] font-semibold uppercase tracking-widest mt-1">
                        Documents
                    </span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-teal-500"
                    href="#"
                >
                    <span className="material-symbols-outlined">
                        contact_support
                    </span>
                    <span className="font-['Inter'] text-[10px] font-semibold uppercase tracking-widest mt-1">
                        Support
                    </span>
                </a>
            </nav>
        </div>
    );
};

export default AdminAnalytics;
