import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import NavPopover from "./nav-popover";
import SignInButton from "./sign-in-button";
import { ThemeToggle } from "./theme-toggle";
import UserAccountNav from "./user-account-nav";
import { auth } from "@/auth";



const Navbar = async () => {
    const session = await auth();

    return (
        <header className="sticky top-3 z-10 flex items-center justify-between gap-8 rounded-full border border-border px-2.5 py-1.5 backdrop-blur-lg md:top-6 mx-auto w-full max-w-4xl">
            <div className="flex items-center gap-6">
                <div className="ml-3 flex items-center gap-3">
                    <Link href={"/"} className="flex items-center gap-2">
                        <p className="px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
                            Inspector Security
                        </p>
                    </Link>
                </div>
                <div className="mx-auto hidden items-center justify-center border border-transparent md:flex md:gap-1">
                    <nav className="relative z-10 flex max-w-max flex-1 items-center justify-center">
                        <NavPopover />
                    </nav>
                </div>
            </div>
            <div className="flex items-center justify-end gap-3">
                <ThemeToggle className="mr-4 rounded-2xl " />
                {session?.user ? (
                    <UserAccountNav user={session.user} />
                ) : (
                    <SignInButton text={"Войти"} />
                )}
            </div>
        </header >
    );
};

export default Navbar;
