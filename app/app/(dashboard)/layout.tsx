
import { auth } from '@/auth';
import BreadcrumbHeader from '@/components/breadcrumb-header';
import { DesktopSidebar, MobileSidebar } from '@/components/dashboard-v2/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import UserAccountNav from '@/components/user-account-nav';
import { redirect } from 'next/navigation';
import React from 'react';
import { cookies } from 'next/headers';
import { TooltipProvider } from '@/components/ui/tooltip';
import WrapperDashboardLayoutResizable from '@/components/dashboard-v2/wrapper-dashboard-layout-resizable';
import WrapperDashboardLayout from '@/components/dashboard-v2/wrapper-dashboard-layout';
import { GetWorkflowsForUser } from '@/actions/workflows/get-workflows-for-user';

async function layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session) {
        return redirect("/auth/login");
    }

    const cookieStore = await cookies();
    const layout = cookieStore.get("react-resizable-panels:layout:dashboard");
    const collapsed = cookieStore.get("react-resizable-panels:collapsed");

    const defaultLayout = layout ? JSON.parse(layout.value) : undefined
    const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined
    const workflows = await GetWorkflowsForUser();



    return (
        <WrapperDashboardLayoutResizable
            session={session}
            defaultLayout={defaultLayout}
            defaultCollapsed={defaultCollapsed}
            navCollapsedSize={4}
            workflows={workflows}
        >


            {/* <WrapperDashboardLayout session={session}> */}
            {children}
            {/* </WrapperDashboardLayout> */}
        </WrapperDashboardLayoutResizable>
    );
}

export default layout