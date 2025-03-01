import { LucideIcon } from 'lucide-react';
import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import ReactCountUpWrapper from '../react-count-up-wrapper';
import clsx from 'clsx'; // Для динамической стилизации классов

interface Props {
    title: string;
    value: number;
    icon: LucideIcon;
    color: 'error' | 'info' | 'warning'; // Проп для выбора цвета
}

const colorClasses = {
    error: 'border-red-700',
    info: 'border-blue-700',
    warning: 'border-yellow-700',
};

function StatsCard({ title, value, icon: Icon, color }: Props) {
    return (
        <Card className={clsx('relative overflow-hidden h-full', colorClasses[color])}>
            <CardHeader className='flex pb-2'>
                <CardTitle className="">{title}</CardTitle>
                <Icon
                    size={120}
                    className='text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10' />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    <ReactCountUpWrapper value={value} />
                </div>
            </CardContent>
        </Card>
    );
}

export default StatsCard;
