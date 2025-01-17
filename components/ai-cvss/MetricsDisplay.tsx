"use client"
import React, { useState } from "react";


const MetricsDisplay = () => {
  const [metrics, setMetrics] = useState({
    attackVector: '',
    attackComplexity: '',
    privilegesRequired: '',
    userInteraction: '',
    scope: '',
    confidentiality: '',
    integrity: '',
    availability: '',
  });

  const [cvssScore, setCvssScore] = useState<number | null>(null);

  // Функция для обработки кнопки, которая делает асинхронный запрос
  const handleButtonClick = async (metric: string, value: string) => {
    setMetrics((prev) => ({
      ...prev,
      [metric]: value,
    }));

    // Пример асинхронной операции
    try {
      const response = await fetch('/api/some-endpoint', {
        method: 'POST',
        body: JSON.stringify({ metric, value }),
      });
      await response.json();

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateCvss = () => {
    let score = 0;
    if (metrics.attackVector === 'Network') score += 0.85;
    if (metrics.attackComplexity === 'Low') score += 0.77;
    if (metrics.privilegesRequired === 'None') score += 0.85;
    if (metrics.userInteraction === 'None') score += 0.85;
    if (metrics.scope === 'Unchanged') score += 0.0;
    setCvssScore(score);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">                <h1>Artificial Intelligence Common Vulnerability Scoring System (AI CVSS) v1.0 Calculator </h1>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(metrics).map((metric) => (
          <div key={metric} className="space-y-2">
            <h2 className="font-semibold">{metric}</h2>
            <div className="flex flex-wrap gap-2">
              {/* Изменение значений с асинхронным запросом */}
              {['Network', 'Low', 'None'].map((value) => (
                <button
                  key={value}
                  className={`px-4 py-2 border rounded ${metrics[metric as keyof typeof metrics] === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                    }`}
                  onClick={() => handleButtonClick(metric, value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-full w-full"
          onClick={calculateCvss}
        >
          Calculate CVSS Score
        </button>
      </div>

      {cvssScore !== null && (
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold">CVSS Score:</h2>
          <p className="text-3xl font-bold">{cvssScore}</p>
        </div>
      )}
    </div>
  );
}

export default MetricsDisplay;
