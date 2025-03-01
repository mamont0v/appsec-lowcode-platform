"use client";


import { auth } from '@/auth';
import BreadcrumbHeader from '@/components/breadcrumb-header';
import { DesktopSidebar, MobileSidebar } from '@/components/dashboard-v2/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import UserAccountNav from '@/components/user-account-nav';
import React from 'react';

interface Session {
    user?: any; // Define the type of user according to your application's requirements
}

export default function WrapperDashboardLayout({ session, children }: { session: Session, children: React.ReactNode }) {

    return (
        <div className='flex h-screen'>
            <MobileSidebar />
            <DesktopSidebar />

            <div className='flex flex-col flex-1 min-h-screen'>
                <header className='flex items-center justify-between px-6 py-4 h-[50px] container'>
                    <BreadcrumbHeader />
                    <div className="gap-1 flex items-center">
                        <ThemeToggle className="mr-4 rounded-2xl " />
                        {session.user && <UserAccountNav user={session.user} />}

                    </div>
                </header>
                <Separator />

                <div className='overflow-auto'>
                    <div className='flex-1 container py-4 text-accent-foreground'>
                        {children}
                    </div>
                </div>

            </div>
        </div>
    );
}