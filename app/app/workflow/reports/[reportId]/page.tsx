"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "next/navigation";
import GetReportExecutions from "@/actions/workflows/get-report-executions";
import ReportPdf from "@/components/report-pdf";
import StatsCard from "@/components/dashboard/stats-card";
import { Ban, CircleAlert, Info } from "lucide-react";
import parseJson from "parse-json";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ReportPage() {
    const params = useParams();
    const reportId = params?.reportId as string; // Проверяем, что параметр есть

    const { data, error, isLoading } = useQuery({
        queryKey: ["reports", reportId],
        queryFn: () => GetReportExecutions(reportId),
        enabled: Boolean(reportId), // Только если есть reportId
    });

    if (isLoading) return <div>Грузим твой отчет...</div>;
    if (error) return <div>Ошибка загрузки отчета</div>;

    const severityColors: Record<string, string> = {
        error: "border-red-500 bg-red-100 text-red-800",
        warn: "border-yellow-500 bg-yellow-100 text-yellow-800",
        info: "border-blue-500 bg-blue-100 text-blue-800",
    };

    // Парсим результаты aiResults
    let aiResults = data?.data?.aiResults || [];
    try {
        aiResults = parseJson(aiResults);
    } catch (error) {
        aiResults;
    }

    const { totalErrors = 0, totalInfo = 0, totalWarnings = 0, security = 0 } = data?.data?.linterResults?.statistics || {};

    const results = data?.data?.linterResults?.resultSet?.results || [];

    // Объединяем линтер и AI результаты в одну таблицу
    const maxLength = Math.max(results.length, aiResults.length);
    const combinedResults = [];

    for (let i = 0; i < maxLength; i++) {
        const linterData = results[i] || {};
        const aiData = aiResults[i] || {};

        combinedResults.push({
            index: i + 1,
            message: linterData.message || "-",
            path: linterData.path || "-",
            ruleId: linterData.ruleId || "-",
            severity: linterData.ruleSeverity || "-",
            threat: aiData.threat ? "Подтверждено" : (aiData.threat === undefined ? "-" : "Не подтверждено"),
            vulnerability: aiData.vulnerability || "-",
            recommendation: aiData.recommendation || "-",
            recommendations: aiData.recommendations || "-",
        });
    }

    return (
        <div className="border rounded-lg shadow-md overflow-auto p-4">
            <h1 className="text-xl font-bold mb-4">Детали отчета</h1>
            <ReportPdf reportData={data} /> {/* Добавляем кнопку для генерации PDF */}

            {/* Блоки с количеством ошибок, предупреждений и информации */}
            <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h[120px] mt-4">
                <StatsCard
                    title="Ошибки"
                    value={totalErrors}
                    icon={Ban}
                    color="error"
                />
                <StatsCard
                    title="Информационные"
                    value={totalInfo}
                    icon={Info}
                    color="info"
                />
                <StatsCard
                    title="Предупреждения"
                    value={totalWarnings}
                    icon={CircleAlert}
                    color="warning"
                />
            </div>

            {/* Объединенная таблица с результатами AI и Linter */}
            <Table className="mx-auto p-4 rounded-lg shadow-lg mb-8">
                <TableCaption>Сводный список результатов AI и Linter</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead> {/* Нумерация */}
                        <TableHead>Message</TableHead> {/* Для Linter */}
                        <TableHead>Path</TableHead> {/* Для Linter */}
                        <TableHead>Rule</TableHead> {/* Для Linter */}
                        <TableHead>Severity</TableHead> {/* Для Linter */}
                        <TableHead>Threat (AI)</TableHead> {/* Для AI */}
                        <TableHead>Vulnerability (AI)</TableHead> {/* Для AI */}
                        <TableHead>Recommendations (AI)</TableHead> {/* Для AI */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {combinedResults.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9}>Нет найденных проблем.</TableCell>
                        </TableRow>
                    ) : (
                        combinedResults.map((result, index) => (
                            <TableRow key={index} className={severityColors[result.severity] || ""}>
                                <TableCell>{result.index}</TableCell> {/* Нумерация */}
                                <TableCell>{result.message}</TableCell> {/* Для Linter */}
                                <TableCell>{result.path}</TableCell> {/* Для Linter */}
                                <TableCell>{result.ruleId}</TableCell> {/* Для Linter */}
                                <TableCell>{result.severity}</TableCell> {/* Для Linter */}
                                <TableCell>{result.threat}</TableCell> {/* Для AI */}
                                <TableCell>{result.vulnerability}</TableCell> {/* Для AI */}
                                <TableCell>{result.recommendations}</TableCell> {/* Для AI */}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
