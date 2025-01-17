import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';

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
            <div className="p-2">
                <Image

                    priority
                    src="inspector.svg"
                    alt="Inspectorz"
                    width={widthSvg}
                    height={heightSvg}
                />
            </div>
            <div className="flex flex-col items-start">
                <span className="">Inspector</span>
                <span className="">Security</span>
            </div>
        </Link>
    )
}

export default Logo;
