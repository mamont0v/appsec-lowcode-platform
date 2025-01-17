import Logo from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import React from 'react'

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col w-full h-screen'>
            {children}
            <Separator />
            <footer className='flex items-center justify-between p-2'>
                <Logo iconSize={16} fontSize='text-xl' />
                <ThemeToggle />
            </footer>
        </div>
    )
}

export default Layout;