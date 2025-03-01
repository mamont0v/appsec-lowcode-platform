"use client";

import { usePathname } from 'next/navigation';
import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight } from 'lucide-react';

// TODO:
function BreadcrumbHeader() {
    const pathName = usePathname();
    const paths = pathName === "/" ? [""] : pathName?.split("/").filter(Boolean);
    return (
        <div className='flex items-center flex-start'>
            <Breadcrumb className="flex items-center">
                {paths.map((path, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem>
                            <BreadcrumbLink className="capitalize" href={`/${path}`}>
                                {path === "" ? "app" : path}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {index !== paths.length - 1 && <ChevronRight className="h-4 w-4 mx-2" />}
                    </React.Fragment>
                ))}
            </Breadcrumb>
        </div>
    )
}

export default BreadcrumbHeader