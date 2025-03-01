"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

export default function ReportPdf({ reportData }: { reportData: any }) {
    const [loading, setLoading] = useState(false);

    const generatePDF = () => {
        setLoading(true);

        const doc = new jsPDF();
        const margin = 20;
        const maxWidth = 150;  // Максимальная ширина для текста
        let yPos = 20;

        // Заголовок
        doc.setFontSize(16);
        doc.text("Report", margin, yPos);
        yPos += 10;

        // Дата генерации
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date(reportData.createdAt).toLocaleString()}`, margin, yPos);
        yPos += 10;

        // ID и пользователь
        doc.setFontSize(12);
        doc.text(`Report ID: ${reportData.reportId}`, margin, yPos);
        yPos += 10;
        doc.text(`User ID: ${reportData.userId}`, margin, yPos);
        yPos += 15;

        // Раздел Linter Results
        doc.setFontSize(14);
        doc.text("Linter Results", margin, yPos);
        yPos += 10;

        if (reportData.data?.linterResults) {
            doc.setFontSize(10);
            const linterResults = reportData.data.linterResults.resultSet.results || [];
            if (linterResults.length > 0) {
                // Заголовок таблицы для линтера
                doc.text("Message", margin, yPos);
                doc.text("Path", 120, yPos);
                doc.text("Severity", 180, yPos);
                yPos += 10;

                linterResults.forEach((result: any) => {
                    // Разбиваем сообщения на несколько строк
                    const messageLines = doc.splitTextToSize(result.message, maxWidth);
                    const pathLines = doc.splitTextToSize(result.path || 'N/A', maxWidth);

                    // Печатаем result.message
                    messageLines.forEach((line, index) => {
                        doc.text(line, margin, yPos);
                        yPos += 6; // Отступ между строками
                    });

                    // Печатаем result.path
                    pathLines.forEach((line, index) => {
                        doc.text(line, 120, yPos);
                        yPos += 6; // Отступ между строками
                    });

                    // Печатаем result.severity
                    doc.text(result.ruleSeverity || 'N/A', 180, yPos);
                    yPos += 10;
                });
            } else {
                doc.text("No issues found in Linter Results.", margin, yPos);
                yPos += 10;
            }
        }
        yPos += 15;

        // Раздел AI Results
        doc.setFontSize(14);
        doc.text("AI Analysis Results", margin, yPos);
        yPos += 10;

        try {
            const aiResults = JSON.parse(reportData.data.aiResults);
            let aiYPos = yPos;
            if (aiResults.problem) {
                Object.entries(aiResults.problem).forEach(([key, value]: [string, any]) => {
                    doc.text(`${key}: ${value}`, margin, aiYPos);
                    aiYPos += 10;
                });
            } else {
                doc.text("No AI issues found.", margin, aiYPos);
                aiYPos += 10;
            }
        } catch (error) {
            doc.text("Error parsing AI results", margin, yPos);
            yPos += 10;
        }

        // Сохранение PDF
        doc.save(`Report-${reportData.reportId}.pdf`);

        setLoading(false);
    };

    return (
        <div>
            <button
                onClick={generatePDF}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                disabled={loading}
            >
                {loading ? "Идет генерация..." : "Скачать отчет в формате PDF"}
            </button>
        </div>
    );
}
