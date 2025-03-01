// ReportPage.tsx
import React from "react";

const ReportPage = ({ linterResults, aiResults }: { linterResults: any[], aiResults: any[] }) => {
    return (
        <div>
            <h1>Отчет</h1>

            <h2>Результаты линтера</h2>
            {linterResults && linterResults.length > 0 ? (
                <ul>
                    {linterResults.map((result, index) => (
                        <li key={index}>
                            <strong>{result.message}</strong>
                            <br />
                            <span>Severity: {result.severity}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет данных о линтере.</p>
            )}

            <h2>Результаты AI</h2>
            {aiResults && aiResults.length > 0 ? (
                <ul>
                    {aiResults.map((result, index) => (
                        <li key={index}>
                            <strong>{result.message}</strong>
                            <br />
                            <span>Severity: {result.severity}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет данных AI.</p>
            )}
        </div>
    );
};

export default ReportPage;
