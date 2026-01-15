
import React from 'react';

interface Props {
  config: any;
  scores: any;
  onBackToEdit: () => void;
  onGoHome: () => void;
  lang: string;
  darkMode: boolean;
}

const ResultsAndAnalysis: React.FC<Props> = ({ config, scores, onBackToEdit, onGoHome, lang, darkMode }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-black text-gray-800 dark:text-white">النتائج والتحليل</h1>
                <div className="flex gap-4 no-print">
                    <button onClick={onBackToEdit} className="bg-yellow-500 text-white px-6 py-2 rounded-xl font-bold shadow-md">تعديل التقييم</button>
                    <button onClick={onGoHome} className="bg-gray-600 text-white px-6 py-2 rounded-xl font-bold shadow-md">الرئيسية</button>
                    <button onClick={() => window.print()} className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-md">طباعة التقرير</button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-400 text-sm font-bold mb-1 uppercase">إجمالي الأسماء</p>
                    <h3 className="text-4xl font-black text-blue-600">{config.names.length}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-400 text-sm font-bold mb-1 uppercase">إجمالي البنود</p>
                    <h3 className="text-4xl font-black text-secondary">{config.items.length}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-400 text-sm font-bold mb-1 uppercase">متوسط الأداء</p>
                    <h3 className="text-4xl font-black text-accent">85%</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-400 text-sm font-bold mb-1 uppercase">الحالة</p>
                    <h3 className="text-2xl font-black text-green-500">مكتمل</h3>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border dark:border-gray-700">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="p-6 font-black text-gray-700 dark:text-gray-200">الاسم</th>
                            <th className="p-6 font-black text-gray-700 dark:text-gray-200">المجموع</th>
                            <th className="p-6 font-black text-gray-700 dark:text-gray-200">النسبة</th>
                            <th className="p-6 font-black text-gray-700 dark:text-gray-200">التقدير</th>
                        </tr>
                    </thead>
                    <tbody>
                        {config.names.map((n: any) => (
                            <tr key={n.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                                <td className="p-6 font-bold text-gray-800 dark:text-gray-100">{n.main}</td>
                                <td className="p-6 font-medium text-gray-600 dark:text-gray-400">120</td>
                                <td className="p-6 text-primary font-black">92%</td>
                                <td className="p-6">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">ممتاز</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default ResultsAndAnalysis;
