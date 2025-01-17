"use client";
import React from "react";

type Props = {
    children?: React.ReactNode
};

const MainContainer = ({ children, ...props }: Props) => {
    return (
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-start justify-center">
            <div className="w-full rounded-lg border border-border px-3 py-4 backdrop-blur-[2px] md:p-6">
                {children}
            </div>

        </div>
    );
};

export default MainContainer;
