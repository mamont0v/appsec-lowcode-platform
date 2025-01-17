import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function NotFoundPage() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4           bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-600 to-neutral-900
'>
            <div className="text-center">
                <h1 className='text-6xl font-bold text-primary mb-4'>404</h1>
                <h2 className='text-2xl font-semibold mb-4'>Агент 404, миссия провалена... но не совсем! 🕵️‍♂️</h2>
                <p className='text-muted-foreground mb-8 max-w-lg'>
                    Вы проникли на территорию, которой не существует — настоящая секретная операция! 🤫 Возможно, страница была засекречена, или кто-то из агентов стёр её следы. Не волнуйтесь, Центр управления уже в пути, чтобы помочь вам найти нужное. Пока они работают, вы можете вернуться на базу (нажать «Назад») или отправиться на другую миссию с помощью меню. Агент, удачи! 🌐💼
                </p>
                <div className='flex flex-col sm:flex-row justify-center gap-4'>
                    <Link href={"/"} className='flex items-center justify-center px-4 py-2  text-white rounded-md hover:bg:primary/80 transition-colors'>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Назад
                    </Link>
                </div>
            </div>
            <footer className='mt-12 text-center text-sm text-muted-foreground'>
                Агент, если ты уверен что тут ошибка напиши в поддержку!
            </footer>
        </div>
    )
}

export default NotFoundPage