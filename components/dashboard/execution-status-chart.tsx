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
import { Layers2 } from 'lucide-react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, AreaChart, Area } from 'recharts';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from "@/components/ui/chart";


type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>


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

export default function ExecutionStatusChart({ data }: { data: ChartData }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl font-bold flex items-center gap-2'>
                    <Layers2 className="w-6 h-6 text-primary" />
                    Статус по рабочим процессам
                </CardTitle>
                <CardDescription>
                    Ежедневная статистика успешных и неудачных запусков рабочих процессов.
                </CardDescription>
            </CardHeader>
            <CardContent>

                <ChartContainer
                    config={chartConfig}
                    className='max-h-[200px] w-full'
                >
                    <AreaChart
                        data={data}
                        height={200}
                        accessibilityLayer
                        margin={{ top: 20 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey={"date"} />
                        <ChartLegend />
                        <ChartTooltip />

                        <Area
                            min={0}
                            type={"bump"}
                            fillOpacity={0.6}
                            fill="var(--color-success)"
                            stroke="var(--color-success)"
                            dataKey={"success"}
                            stackId={"a"}
                        />

                        <Area
                            min={0}
                            type={"bump"}
                            fillOpacity={0.6}
                            fill="var(--color-failed)"
                            stroke="var(--color-failed)"
                            dataKey={"failed"}
                            stackId={"a"}
                        />
                    </AreaChart>
                </ChartContainer>

            </CardContent>
        </Card>
    )
}

