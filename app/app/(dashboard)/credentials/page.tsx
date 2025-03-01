import { GetCredentialsForUser } from '@/actions/credentials/get-credentials-for-user';
import CreateCredentialsDialog from '@/components/billing/create-credentials-dialog';
import DeleteCredentialsDialog from '@/components/billing/delete-credentials-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistance, formatDistanceToNow } from 'date-fns';
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from 'lucide-react';
import React, { Suspense } from 'react'

function CredentialsPage() {
    return (
        <div className="flex flex-1 flex-col h-full">
            <div className="flex justify-between">

                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">
                        Учетные данные
                    </h1>
                    <p className="text-muted-foreground">
                        Управление учетными данными, API ключами и настройками
                    </p>
                </div>
                <CreateCredentialsDialog triggerText='Добавить' />
            </div>

            <div className="h-full py-6 space-y-8">
                <Alert>
                    <ShieldIcon className='h-4 w-4 stroke-primary' />
                    <AlertTitle className='text-primary'>Шифрование</AlertTitle>
                    <AlertDescription>
                        Вся ваша информация зашифрована и находится в безопасном сейфе
                    </AlertDescription>
                </Alert>
                <Suspense fallback={<Skeleton className='h-[300px] w-full' />}>
                    <UserCredentials />
                </Suspense>
            </div>
        </div>
    )
}

// поскольку асинхронный компонент нужно в Loader Suspense обворачивать
async function UserCredentials() {
    const credentials = await GetCredentialsForUser();

    if (!credentials) {
        return <div>Что-то пошло не так</div>
    }

    if (credentials.length === 0) {
        return (
            <Card className='w-full p-4'>
                <div className="flex flex-col gap-4 items-center justify-center">
                    <div className="rounded-full border w-20 h-20 flex items-center justify-center">
                        <ShieldOffIcon size={40} className='stroke-primary' />
                    </div>
                    <div className="flex flex-col gap-1 text-center">
                        <p className="text-bold">
                            Учетные данные не созданы
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Нажми на кнопку ниже чтобы создать свои учетные данные
                        </p>
                        <CreateCredentialsDialog triggerText='Добавьте свои первые секреты в сейф' />
                    </div>
                </div>
            </Card>
        );
    }
    //<pre>{JSON.stringify(credentials, null, 4)}</pre>
    return (
        <div className="flex gap-2 flex-wrap">
            {credentials.map((credential) => {
                const createdAt = formatDistanceToNow(credential.createdAt, {
                    addSuffix: true
                });
                return (
                    <Card key={credential.id} className='w-full p-4 flex justify-between'>
                        <div className='flex gap-2 items-center'>
                            <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                                <LockKeyholeIcon size={18} className='stroke-primary' />
                            </div>
                            <div>
                                <p className="font-bold">
                                    {credential.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {createdAt}
                                </p>
                            </div>
                        </div>
                        <DeleteCredentialsDialog name={credential.name} />
                    </Card>
                )
            })}
        </div>
    )

}

export default CredentialsPage;