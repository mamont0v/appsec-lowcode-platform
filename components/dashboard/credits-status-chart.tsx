"use client";

import { GetWorkflowExecutionStats } from '@/actions/analytics/get-workflow-execution-stats'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartColumnStackedIcon, Layers2 } from 'lucide-react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, AreaChart, Area, BarChart, Bar } from 'recharts';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from "@/components/ui/chart";
import { GetCreditsStats } from '@/actions/analytics/get-credits-stats';


type ChartData = Awaited<ReturnType<typeof GetCreditsStats>>


const chartConfig = {
    success: {
        label: "Success",
        color: "hsl(var(--chart-2))",
    },
    failed: {
        label: "Failed",
        color: "hsl(var(--chart-1))"
    }
}

export default function CreditsStatusChart({
    data,
    title,
    description
}: {
    data: ChartData,
    title: string,
    description: string,
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl font-bold flex items-center gap-2'>
                    <ChartColumnStackedIcon className="w-6 h-6 text-primary" />
                    {title}
                </CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>

                <ChartContainer
                    config={chartConfig}
                    className='max-h-[200px] w-full'
                >
                    <BarChart
                        data={data}
                        height={200}
                        accessibilityLayer
                        margin={{ top: 20 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey={"date"} />
                        <ChartLegend />
                        <ChartTooltip />

                        <Bar
                            fillOpacity={0.8}
                            radius={[0, 0, 6, 6]}
                            fill="var(--color-success)"
                            stroke="var(--color-success)"
                            dataKey={"success"}
                            stackId={"a"}
                        />

                        <Bar
                            fillOpacity={0.8}
                            radius={[6, 6, 0, 0]}
                            fill="var(--color-failed)"
                            stroke="var(--color-failed)"
                            dataKey={"failed"}
                            stackId={"a"}
                        />
                    </BarChart>
                </ChartContainer>

            </CardContent>
        </Card>
    )
}

