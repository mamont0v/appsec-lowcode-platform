"use client"
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from './ui/input';
import WorkflowCard from './workflows/workflow-card';
import { Workflow } from "@prisma/client";

// Тип данных для workflow
// interface Workflow {
//     id: string;
//     name: string;
//     userId: string;
//     description: string | null;
//     creditsCost: number;
//     executionPlan: string | null;
//     cron: string | null;
//     nextRunAt: Date | null;
//     definition: string;
//     createdAt: Date;
//     updatedAt: Date;
//     status: string;
//     lastRunAt: Date | null;
//     lastRunId: string | null;
//     lastRunStatus: string | null;
// }

interface SearcherProps {
    workflows: Workflow[];
}

export default function Searcher({ workflows }: SearcherProps) {
    const [searchTerm, setSearchTerm] = useState(""); // Хранение строки поиска

    const filteredWorkflows = workflows?.filter(workflow =>
        workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='grid grid-cols-1 gap-4'>
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <form>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Поиск"
                            className="pl-8 w-64 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </form>
            </div>
            <div className="space-y-4">
                {/* Отображаем отфильтрованные рабочие процессы */}
                {filteredWorkflows?.length > 0 ? (
                    filteredWorkflows.map((workflow) => (
                        <WorkflowCard key={workflow.id} workflow={workflow} />
                    ))
                ) : (
                    <p>Нет проектов, удовлетворяющих запросу.</p>
                )}
            </div>
        </div>
    );
}
