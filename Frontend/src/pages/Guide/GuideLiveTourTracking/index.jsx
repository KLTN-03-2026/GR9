import React from 'react';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    FileText,
    Hotel,
    MapPinned,
    Phone,
    Plus,
    Sailboat,
    Stethoscope,
    Users,
    UtensilsCrossed,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const timelineItems = [
    {
        title: 'Morning Hotel Pickup',
        location: 'The Ritz-Carlton Atoll',
        time: '08:00 AM',
        meta: '12 Guests',
        status: 'Completed',
        statusClass: 'bg-primary/10 text-primary',
        dotClass: 'bg-primary border-surface-container-lowest',
        cardClass:
            'border border-outline-variant/10 bg-surface-container-lowest shadow-sm',
        iconWrapperClass: 'bg-primary/10 text-primary',
        icon: Hotel,
        active: false,
        muted: false,
    },
    {
        title: 'Azure Horizon Boat Tour',
        location: 'North Lagoon Dock 4',
        status: 'In Progress',
        statusClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
        dotClass:
            'bg-tertiary border-surface-container-lowest ring-4 ring-tertiary/20',
        cardClass:
            'border-2 border-primary/20 bg-surface-container-lowest shadow-[0px_20px_40px_rgba(25,28,30,0.06)]',
        iconWrapperClass: 'bg-tertiary/10 text-tertiary',
        icon: Sailboat,
        active: true,
        muted: false,
    },
    {
        title: 'Seafood Lunch Buffet',
        location: 'Coral Terrace Restaurant',
        time: '12:30 PM',
        meta: 'VIP Reserved',
        status: 'Scheduled',
        statusClass: 'bg-surface-container-highest text-on-surface-variant',
        dotClass: 'bg-surface-container-highest border-surface-container-lowest',
        cardClass:
            'border border-outline-variant/10 bg-surface-container-low/50 opacity-75',
        iconWrapperClass:
            'bg-surface-container-highest text-on-surface-variant',
        icon: UtensilsCrossed,
        active: false,
        muted: true,
    },
];

const quickActions = [
    { label: 'Start', icon: Activity, className: 'text-on-surface-variant hover:bg-primary hover:text-white' },
    {
        label: 'Mark Done',
        icon: CheckCircle2,
        className: 'text-on-surface-variant hover:bg-primary hover:text-white',
    },
    {
        label: 'Delay',
        icon: AlertTriangle,
        className: 'text-on-surface-variant hover:bg-primary hover:text-white',
    },
    {
        label: 'Note',
        icon: FileText,
        className: 'text-on-surface-variant hover:bg-primary hover:text-white',
    },
];

const notificationPills = [
    'We are on the way',
    'Arrived at dock',
    'Lunch is ready',
];

const emergencyContacts = [
    {
        title: 'Operations Desk',
        subtitle: 'Priority Support',
        icon: Phone,
        containerClass: 'border-error/10 bg-error-container/20',
        iconClass: 'bg-error/10 text-error',
        actionClass:
            'border border-transparent bg-transparent text-error shadow-sm hover:border-error/10 hover:bg-white',
    },
    {
        title: 'Local Medical',
        subtitle: '+960 333-5335',
        icon: Stethoscope,
        containerClass: 'border-outline-variant/10 bg-surface-container-low',
        iconClass: 'bg-on-secondary-container/10 text-on-secondary-container',
        actionClass:
            'border border-transparent bg-transparent text-on-surface-variant shadow-sm hover:border-primary/10 hover:bg-white hover:text-primary',
    },
];

const trackingGuests = [
    {
        name: 'Sarah',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg_jGocPqxAmdVviPsdoNcnYLyy8oR0qwz9OE2o7VtOPXdIh6vaVfeizbASJjhv0Cd1RoLA2RE4T3uD0keV7ADmovCnVWLUQX6YDetc1ycIWOAWdlrsC6ur4S5OZfymcSQIGje_a_8sxxetpTE1iW9TrKStbzFOQZjwvZvxq48Lkagoee0ml_fSdmZxln-9aREzdbUoYXtHH0l2Qwuwi-R4eXxF2OR9NuFyyokoqyZmJxm0xF8aIBABxSvC7YGhB9biUvIFydEdRBO',
    },
    {
        name: 'Daniel',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1ndsgy58FfEvTqeE98fxrI2jYJRcNK5wk6Ee8BzIeONsYccg1vucM75gWIq6D2_upPS8o2sKVtozer1RydQnSYtXXZREI_nvP5Dmq5ksLzMSP1g-cydjfAoLrzuUxWsPI_5S0S3sk9h30H2o7RmhNHOczWST5AMBeLTVq6ht5sG5gPyafXP2d6KB1dTV4oFJcXnolBsiKe5VZuNH-gT5mavvTW2rMuq47nKF8TODCg19dqIks5wxW6HXT2cMihRhKkhaP1rSnutVs',
    },
];

const sharedHoverMotion =
    'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0';

const elevatedGhostButton =
    'border border-transparent bg-surface-container-low shadow-sm hover:border-primary/10 hover:bg-white';

const pillButtonHover =
    'border border-transparent bg-secondary-container shadow-sm hover:border-secondary/15 hover:bg-white hover:text-secondary';

const GuideLiveTourTracking = () => {
    return (
        <div className="space-y-8 px-4 py-8 md:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <div className="flex flex-col gap-8 md:flex-row">
                    <div className="flex-1 space-y-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                                    Execution Mode
                                </span>
                                <h1 className="mt-1 font-headline text-3xl font-extrabold text-on-surface">
                                    Today&apos;s Live Timeline
                                </h1>
                            </div>

                            <span className="inline-flex items-center gap-2 rounded-full bg-tertiary-container/10 px-3 py-1 text-xs font-bold text-tertiary">
                                <span className="h-2 w-2 rounded-full bg-tertiary animate-pulse" />
                                LIVE UPDATING
                            </span>
                        </div>

                        <div className="relative space-y-6 before:absolute before:bottom-4 before:left-6 before:top-4 before:w-0.5 before:bg-surface-container-highest before:content-['']">
                            {timelineItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div key={item.title} className="relative pl-14">
                                        <div
                                            className={`absolute left-4 top-6 z-10 h-4 w-4 rounded-full border-4 ${item.dotClass}`}
                                        />

                                        <Card
                                            className={`rounded-xl py-0 transition-shadow hover:shadow-md ${item.cardClass}`}
                                        >
                                            <CardContent className="p-6">
                                                <div className="mb-4 flex items-start justify-between gap-4">
                                                    <div className="flex gap-4">
                                                        <div
                                                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconWrapperClass}`}
                                                        >
                                                            <Icon className="h-5 w-5" />
                                                        </div>

                                                        <div>
                                                            <h3 className="font-headline text-lg font-bold text-on-surface">
                                                                {item.title}
                                                            </h3>
                                                            <p className="text-sm text-on-surface-variant">
                                                                {item.location}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-tight ${item.statusClass}`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </div>

                                                {item.active ? (
                                                    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                        {quickActions.map((action) => {
                                                            const ActionIcon = action.icon;

                                                            return (
                                                                <Button
                                                                    key={action.label}
                                                                    className={`h-auto flex-col gap-1 rounded-xl px-3 py-3 text-[10px] font-bold uppercase ${sharedHoverMotion} ${elevatedGhostButton} ${action.className}`}
                                                                    variant="ghost"
                                                                >
                                                                    <ActionIcon className="h-5 w-5" />
                                                                    {action.label}
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={`flex flex-wrap items-center gap-4 text-xs font-semibold text-on-surface-variant ${item.muted ? 'opacity-70' : ''
                                                            }`}
                                                    >
                                                        <span className="flex items-center gap-1">
                                                            <Clock3 className="h-4 w-4" />
                                                            {item.time}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            {item.title.includes('Lunch') ? (
                                                                <>
                                                                    <MapPinned className="h-4 w-4" />
                                                                    {item.meta}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Users className="h-4 w-4" />
                                                                    {item.meta}
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full space-y-6 md:w-[400px]">
                        <Card className="overflow-hidden rounded-xl border border-outline-variant/10 py-0 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-outline-variant/10 px-4 py-4">
                                <CardTitle className="font-headline text-base font-bold text-on-surface">
                                    Live Tracking Map
                                </CardTitle>
                                <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-600">
                                    GPS ACTIVE
                                </span>
                            </CardHeader>

                            <CardContent className="relative h-64 p-0">
                                <img
                                    alt="Modern minimalist map interface showing a tropical island with a teal route line and a pulsing guide location marker"
                                    className="h-full w-full object-cover grayscale-[0.2]"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZEiBR5evS2evQowx9eAJx1ypkkOToHcNRM6E24XelYO27Ep8Hup9QE51bAZ55hsusf0UmY8qW7Q-Ad8go_R9b5gT4tpmXDoP4hLyjmtBGzNwbm_c7GX-HITnRdfwIL0WhpqDfXEus4io7OY1S6ZwUV-5t7rhJcbDzFwlG_nAYXfz2PtgQWVeUK2exvHo7D8cjq1TR-cbLc-oPPapJwfoR1Dg0sUy69kSsKchQJPFQnhb82E4-VLgW3AzDQoTIPzweV5LfOYsjZvTG"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-primary/5" />

                                <div className="absolute right-4 top-4 flex flex-col gap-2 rounded-lg bg-white p-2 shadow-lg">
                                    <Button
                                        className={`${sharedHoverMotion} ${elevatedGhostButton} rounded-lg`}
                                        size="icon-sm"
                                        variant="ghost"
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        className={`${sharedHoverMotion} ${elevatedGhostButton} rounded-lg`}
                                        size="icon-sm"
                                        variant="ghost"
                                    >
                                        <ZoomOut className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-xl border border-outline-variant/10 py-0 shadow-sm">
                            <CardHeader className="border-b border-outline-variant/10 px-4 py-4">
                                <CardTitle className="font-headline text-base font-bold text-on-surface">
                                    Passenger Notifications
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4 p-4">
                                <div className="flex flex-wrap gap-2">
                                    {notificationPills.map((item) => (
                                        <Button
                                            key={item}
                                            className={`rounded-full px-4 py-2 text-xs font-bold ${sharedHoverMotion} ${pillButtonHover}`}
                                            variant="ghost"
                                        >
                                            {item}
                                        </Button>
                                    ))}
                                </div>

                                <Separator className="bg-outline-variant/10" />

                                <div>
                                    <p className="mb-3 text-[10px] font-bold uppercase text-on-surface-variant">
                                        Emergency Contacts
                                    </p>

                                    <div className="space-y-3">
                                        {emergencyContacts.map((contact) => {
                                            const ContactIcon = contact.icon;

                                            return (
                                                <div
                                                    key={contact.title}
                                                    className={`flex items-center justify-between rounded-xl border p-3 ${contact.containerClass}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${contact.iconClass}`}
                                                        >
                                                            <ContactIcon className="h-4 w-4" />
                                                        </div>

                                                        <div>
                                                            <p className="text-xs font-bold text-on-surface">
                                                                {contact.title}
                                                            </p>
                                                            <p className="text-[10px] font-medium text-on-surface-variant">
                                                                {contact.subtitle}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        className={`rounded-full ${sharedHoverMotion} ${contact.actionClass}`}
                                                        size="icon-sm"
                                                        variant="ghost"
                                                    >
                                                        <Phone className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card className="rounded-[1.75rem] border border-slate-200/20 bg-white/80 py-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-lg">
                    <CardContent className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                        <div className="hidden items-center gap-3 md:flex">
                            <div className="flex -space-x-2">
                                {trackingGuests.map((guest) => (
                                    <Avatar key={guest.name} className="h-8 w-8 border-2 border-white">
                                        <AvatarImage alt={guest.name} src={guest.src} />
                                        <AvatarFallback>{guest.name.slice(0, 1)}</AvatarFallback>
                                    </Avatar>
                                ))}
                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-500">
                                    +10
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-500">
                                Guests tracking your live link
                            </span>
                        </div>

                        <div className="flex w-full gap-4 md:w-auto">
                            <Button className={`flex-1 rounded-xl border-2 border-outline-variant/30 px-6 py-3 font-bold shadow-sm hover:border-primary/20 hover:bg-white hover:text-primary ${sharedHoverMotion} md:flex-none`}>
                                Save Progress Update
                            </Button>
                            <Button className={`flex-1 rounded-xl border-2 border-outline-variant/30 px-6 py-3 font-bold shadow-sm hover:border-primary/20 hover:bg-white hover:text-primary ${sharedHoverMotion} md:flex-none`}>
                                <Plus className="h-4 w-4" />
                                Publish to Tracking Link
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GuideLiveTourTracking;
