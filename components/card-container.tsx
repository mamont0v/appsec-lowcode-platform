import React from 'react'
import SignInButton from './sign-in-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

type Props = {};

const CardContainer = (props: Props) => {
    return (
        <>
            <Card className="w-[300px]">
                <CardHeader>
                    <CardTitle>Inspector Security tech</CardTitle>
                    <CardDescription>
                        Cumюнити любителей вставить кавычку.
                        Сексуально про безопасность приложений!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignInButton text="Войти через Google" />
                </CardContent>
            </Card>
        </>
    )
}

export default CardContainer;