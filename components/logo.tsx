import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import { Ghost, SquareDashedMousePointer } from 'lucide-react';

function Logo({
    fontSize = "text-2xl",
    iconSize = 20,
    widthSvg = 50,
    heightSvg = 50
}: {
    fontSize?: string;
    iconSize?: number;
    widthSvg?: number;
    heightSvg?: number;
}) {
    return (
        <Link href="/" className={cn("text-2xl font-extrabold flex items-center gap-2", fontSize)}>
            {/* <Ghost /> */}
            <div className="p-2">
                <Image
                    priority
                    src="/agent-colorized.svg"
                    alt="logo"
                    width={widthSvg}
                    height={heightSvg}
                    className="shadow-sm"
                />
            </div>
            <div className="flex-col justify-between hidden sm:flex">
                <p className="text-white text-sm">Inspector</p>
                <p className="text-white text-sm">Security</p>
            </div>
        </Link>
    )
}

export default Logo;
