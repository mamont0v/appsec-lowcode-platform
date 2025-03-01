import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function NotFoundPage() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4          absolute inset-0  h-full w-full px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]
'>
            <div className="text-center">
                <h1 className='text-6xl font-bold text-primary mb-4'>404</h1>
                <h2 className='text-2xl font-semibold mb-4'>Агент 404, миссия провалена... но не совсем! 🕵️‍♂️</h2>
                <p className='text-muted-foreground mb-8 max-w-lg'>
                    Вы проникли на территорию, которой не существует — настоящая секретная операция! 🤫 Возможно, страница была засекречена, или кто-то из агентов стёр её следы. Не волнуйтесь, Центр управления уже в пути, чтобы помочь вам найти нужное. Пока они работают, вы можете вернуться на базу (нажать «Назад») или отправиться на другую миссию с помощью меню. Агент, удачи! 🌐💼
                </p>
                <div className='flex flex-col sm:flex-row justify-center gap-4'>
                    <Button className='"inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"'>
                        <Link href={"/"} className='flex items-center justify-center px-4 py-2  text-white rounded-md hover:bg:primary/80 transition-colors'>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Назад
                        </Link>
                    </Button>
                </div>
            </div>
            <footer className='mt-12 text-center text-sm text-muted-foreground'>
                Агент, если ты уверен что тут ошибка напиши в поддержку!
            </footer>
        </div>
    )
}

export default NotFoundPage