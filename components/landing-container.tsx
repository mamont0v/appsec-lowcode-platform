import React from "react";
import Footer from './footer';

type Props = {
    children?: React.ReactNode
};

const LandingContainer = ({ children, ...props }: Props) => {
    return (
        <>
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-start justify-center">
                <div className="grid gap-12">
                    {/* Logo Container */}
                    <div className="my-10 flex w-full flex-col justify-center gap-1 px-3 py-4 text-center md:my-20 md:p-6">
                        <div>
                            <div className="inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground backdrop-blur-[2px]">
                                <a target="_blank" rel="noreferrer" className="flex items-center" href="https://github.com/openstatusHQ/openstatus/stargazers">Proudly Open Source<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right ml-1 h-3 w-3"><path d="m9 18 6-6-6-6"></path></svg></a>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h1 className="font-cal text-4xl md:text-6xl bg-gradient-to-tl from-0% from-[hsl(var(--muted))] to-40% to-[hsl(var(--foreground))] bg-clip-text text-transparent">
                                A better way to monitor your services.
                            </h1>
                            <p className="mx-auto max-w-md text-lg text-muted-foreground md:max-w-xl md:text-xl">Monitor your API and website globally, identify performance issues, downtime and receive alerts before your users are affected.</p>
                        </div>
                        <div className="my-4 grid gap-2 sm:grid-cols-2">
                            <div className="text-center sm:block sm:text-right">
                                <a className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-48 rounded-full sm:w-auto">Get Started</a>
                            </div>
                            <div className="text-center sm:block sm:text-left">
                                <a target="_blank" className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-48 rounded-full sm:w-auto __web-inspector-hide-shortcut__">
                                    Star on GitHub
                                    <div className="items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground ml-1 hidden sm:block">6.5K</div>
                                    <div className="items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground ml-1 block sm:hidden">6542</div>
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Banner Container */}
                    <div className="grid gap-4">
                        <h3 className="text-center font-cal text-muted-foreground text-sm">Trusted By</h3>
                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-16">
                            <div className="flex items-center justify-center">
                                <a href="https://status.hanko.io" target="_blank" rel="noreferrer" className="">
                                    <svg></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Card Container */}

                    {/*  Container */}

                </div>
            </div>

        </>
    );
}

export default LandingContainer;

