"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

const NavPopover = () => {
    const [open, setOpen] = useState([false, false, false]); // Массив состояний для трех разделов
    const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Для хранения таймера

    // Обработчик открытия и закрытия для каждого раздела
    const handlePopoverToggle = (index: number, isOpen: boolean) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current); // Очищаем предыдущий таймер
        setOpen(prev => {
            const newState = [...prev];
            newState[index] = isOpen;
            return newState;
        });
    };

    // Функция для обработки открытия и закрытия на кнопке и контенте
    const handlePopoverHover = (index: number, isOpen: boolean) => {
        // Используем задержку, чтобы избежать дрожания
        if (timeoutRef.current) clearTimeout(timeoutRef.current); // Очистить предыдущий таймер

        timeoutRef.current = setTimeout(() => {
            setOpen(prev => {
                const newState = [...prev];
                newState[index] = isOpen;
                return newState;
            });
        }, 100); // Установить задержку в 100мс для более плавного перехода
    };

    return (
        <div>
            <ul className="group flex flex-1 list-none items-center justify-center space-x-1">
                {/* Первый раздел */}
                <li>
                    <Popover open={open[0]} onOpenChange={(isOpen) => handlePopoverToggle(0, isOpen)}>
                        <PopoverTrigger asChild>
                            <Button
                                onMouseEnter={() => handlePopoverHover(0, true)}
                                onMouseLeave={() => handlePopoverHover(0, false)}
                                className="group inline-flex w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 group h-9 rounded-full bg-transparent text-muted-foreground hover:bg-transparent data-[state=open]:text-accent-foreground"
                            >
                                Услуги
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            onMouseEnter={() => handlePopoverHover(0, true)} // Оставляем меню открытым при наведении на контент
                            onMouseLeave={() => handlePopoverHover(0, false)} // Закрываем при уходе мыши
                            className="w-80"
                        >
                            <div className="grid gap-4">
                                <h4 className="font-medium leading-none">Dimensions</h4>
                                <p className="text-sm text-muted-foreground">
                                    <Link href="/services">
                                        Все услуги
                                    </Link>
                                </p>
                            </div>
                        </PopoverContent>
                    </Popover>
                </li>

                {/* Второй раздел */}
                <li>
                    <Popover open={open[1]} onOpenChange={(isOpen) => handlePopoverToggle(1, isOpen)}>
                        <PopoverTrigger asChild>
                            <Button
                                onMouseEnter={() => handlePopoverHover(1, true)}
                                onMouseLeave={() => handlePopoverHover(1, false)}
                                className="group inline-flex w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 group h-9 rounded-full bg-transparent text-muted-foreground hover:bg-transparent data-[state=open]:text-accent-foreground"
                            >
                                Продукты
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            onMouseEnter={() => handlePopoverHover(1, true)} // Оставляем меню открытым при наведении на контент
                            onMouseLeave={() => handlePopoverHover(1, false)} // Закрываем при уходе мыши
                            className="w-80"
                        >
                            <div className="grid gap-4">
                                <h4 className="font-medium leading-none">Settings</h4>
                                <p className="text-sm text-muted-foreground">
                                    Customize your settings.
                                </p>
                            </div>
                        </PopoverContent>
                    </Popover>
                </li>

                {/* Третий раздел */}
                <li>
                    <Popover open={open[2]} onOpenChange={(isOpen) => handlePopoverToggle(2, isOpen)}>
                        <PopoverTrigger asChild>
                            <Button
                                onMouseEnter={() => handlePopoverHover(2, true)}
                                onMouseLeave={() => handlePopoverHover(2, false)}
                                className="group inline-flex w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 group h-9 rounded-full bg-transparent text-muted-foreground hover:bg-transparent data-[state=open]:text-accent-foreground"
                            >
                                Section 3
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            onMouseEnter={() => handlePopoverHover(2, true)} // Оставляем меню открытым при наведении на контент
                            onMouseLeave={() => handlePopoverHover(2, false)} // Закрываем при уходе мыши
                            className="w-80"
                        >
                            <div className="grid gap-4">
                                <h4 className="font-medium leading-none">Info</h4>
                                <p className="text-sm text-muted-foreground">
                                    More information and details.
                                </p>
                            </div>
                        </PopoverContent>
                    </Popover>
                </li>
            </ul>
        </div>
    );
};

export default NavPopover;
