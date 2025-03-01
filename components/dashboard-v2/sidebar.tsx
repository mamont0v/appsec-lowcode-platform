"use client";

import { GraduationCap, HomeIcon, Key, MenuIcon, ReceiptRussianRuble, Settings, Workflow } from 'lucide-react';
import React, { useState, Suspense } from 'react';
import Logo from '@/components/logo';
import Link from 'next/link';
import { Button, buttonVariants } from '../ui/button';
import { usePathname } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import UserAvailableCreditsBadge from '../user-available-credits-badge';

const routes = [
    {
        href: "/app",
        label: "Дашборд",
        icon: HomeIcon
    },
    {
        href: "/app/workflows",
        label: "Рабочие процессы",
        icon: Workflow
    },
    // {
    //     href: "/app/billing",
    //     label: "Платежи",
    //     icon: ReceiptRussianRuble
    // },
    {
        href: "/app/quiz",
        label: "Квиз",
        icon: GraduationCap
    },
    {
        href: "/app/credentials",
        label: "Учетные данные",
        icon: Key
    },
    {
        href: "/app/settings",
        label: "Настройки",
        icon: Settings
    }
];

export function DesktopSidebar() {
    const pathname = usePathname();

    const activeRoute = routes.find(
        (route) => pathname.startsWith(route.href) && pathname.length === route.href.length
    ) || routes[0];

    return (
        <div className='hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-forreground text-muted-foreground border-r-2 border-separate'>
            <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-2">
                <Logo />
            </div>
            <div className="p-2">
                <UserAvailableCreditsBadge />
            </div>
            <div className="flex flex-col">
                {/* TODO: Переделать оберку для кнопки ButtonWrapper */}
                {routes.map((route) => (
                    <div key={route.href} className="flex flex-col p-2">
                        <Link
                            href={route.href}
                            className={buttonVariants({
                                variant: activeRoute.href === route.href ? "sidebarActiveItem" : "sidebarItem",
                            })}
                        >
                            <route.icon size={20} />
                            {route.label}
                        </Link>
                    </div>
                ))}
            </div>

        </div>
    )
}

export function MobileSidebar() {
    const [isOpen, setOpen] = useState<boolean>(false);

    const pathname = usePathname();
    const activeRoute = routes.find(
        (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];
    return (
        <div className='block border-separate bg-background md:hidden'>
            <nav className='container flex items-center justify-between px-8'>
                <Sheet open={isOpen} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                            <MenuIcon />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='w-[400px] sm:w-[540px] space-y-4' side={"left"}>
                        <Logo />
                        <UserAvailableCreditsBadge />
                        <SheetTitle></SheetTitle>
                        <SheetDescription></SheetDescription>
                        <div className='flex flex-col gap-1'>
                            {routes.map((route) => (
                                <div key={route.href} className="flex flex-col p-2">
                                    <Link
                                        href={route.href}
                                        className={buttonVariants({
                                            variant: activeRoute.href === route.href ? "sidebarActiveItem" : "sidebarItem",
                                        })}
                                        onClick={() => setOpen((prev) => !prev)}
                                    >
                                        <route.icon size={20} />
                                        {route.label}
                                    </Link>
                                </div>
                            ))}
                        </div>

                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    )
}

