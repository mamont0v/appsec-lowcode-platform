import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"


type Props = {};

export const metadata = {
    title: "App",
    description: "Ваши сервисы",
};

function HomePage() {
    return (
        <>test</>
    )
}


export default HomePage;
