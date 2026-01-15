import React, { useState, useMemo } from 'react';
import { EvaluationConfig, Scores } from '../types';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet, Home, Edit } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface ResultsProps {
    config: EvaluationConfig;
    scores: Scores;
    onBackToEdit: () => void;
    onGoHome: () => void;
    darkMode: boolean;
    toggleTheme: () => void;
    t: (key: string, params?: any) => string;
    toggleLang: () => void;
    lang: string;
}

const ResultsAndAnalysis: React.FC<ResultsProps> = ({ config, scores, onBackToEdit, onGoHome, t, lang }) => {
    // Basic processing logic
    const processedResults = useMemo(() => {
        return config.names.map(person => {
            let totalScore = 0;
            let validItemsCount = 0;
            const itemScores: Record<number, number> = {};
            config.items.forEach(item => {
                let s = scores[`${item.id}_${person.id}`];
                if (s === undefined) s = 0; 
                itemScores[item.id] = s as number;
                
                if (s !== -1) {
                    totalScore += s as number;
                    validItemsCount++;
                }
            });
            const maxPossible = validItemsCount * config.maxScore;
            const percent = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;
            return {
                ...person, itemScores, totalScore, percent
            };
        });
    }, [config, scores]);

    // Export Logic
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const data = processedResults.map(p => ({
            "الاسم": p.main,
            "الفرع": p.sub,
            "النقاط": p.totalScore,
            "النسبة": p.percent.toFixed(2) + '%'
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "النتائج");
        XLSX.writeFile(wb, "Evaluation_Results.xlsx");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
             <div className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
                 <h2 className="text-xl font-bold">{t('results_title')}</h2>
                 <div className="flex gap-2">
                     <button onClick={exportToExcel} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"><FileSpreadsheet className="w-4 h-4"/> Excel</button>
                     <button onClick={onBackToEdit} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded"><Edit className="w-4 h-4"/> {t('edit_eval')}</button>
                     <button onClick={onGoHome} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded"><Home className="w-4 h-4"/> {t('home')}</button>
                 </div>
             </div>

             <div className="bg-white rounded shadow overflow-x-auto">
                 <table className="w-full text-right border-collapse">
                     <thead className="bg-gray-100">
                         <tr>
                             <th className="p-3 border">#</th>
                             <th className="p-3 border">{t('name_col')}</th>
                             <th className="p-3 border">{t('branch')}</th>
                             <th className="p-3 border">{t('total')}</th>
                             <th className="p-3 border">{t('percent')}</th>
                         </tr>
                     </thead>
                     <tbody>
                         {processedResults.map((r, i) => (
                             <tr key={i} className="border-b">
                                 <td className="p-3 border">{i + 1}</td>
                                 <td className="p-3 border font-bold">{r.main}</td>
                                 <td className="p-3 border">{r.sub}</td>
                                 <td className="p-3 border">{r.totalScore}</td>
                                 <td className="p-3 border font-bold text-blue-600">{r.percent.toFixed(1)}%</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
             
             {/* Chart Example */}
             <div className="mt-8 bg-white p-4 rounded shadow h-96">
                <Bar 
                    data={{
                        labels: processedResults.map(p => p.main),
                        datasets: [{
                            label: t('percent'),
                            data: processedResults.map(p => p.percent),
                            backgroundColor: '#1e40af',
                            borderRadius: 4
                        }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                />
             </div>
        </div>
    );
};

export default ResultsAndAnalysis;
