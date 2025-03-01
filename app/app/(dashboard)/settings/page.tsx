import { SetupUser } from '@/actions/billing/setup-user';
import { revalidatePath } from 'next/cache';
import React from 'react'

async function SettingsPage() {
    await SetupUser();
    return (
        <div className='flex-1 flex flex-col h-full'>
            <div className="flex justify-between">
                <div className="flex flex-col">

                    <h1 className="text-3xl font-bold">
                        Настройки
                    </h1>

                    <p className="text-muted-foreground">
                        Управление твоими настройками
                    </p>
                </div>
                {/* <QuizCreation topic={topic} /> */}
            </div>

            <div className="h-full py-6">

            </div>
        </div>
    )

}

export default SettingsPage;