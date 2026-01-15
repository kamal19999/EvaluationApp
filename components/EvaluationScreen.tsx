
import React, { useState } from 'react';

interface Props {
  config: any;
  scores: any;
  setScores: any;
  onFinish: () => void;
  onBack: () => void;
  lang: string;
  darkMode: boolean;
}

const EvaluationScreen: React.FC<Props> = ({ config, scores, setScores, onFinish, onBack, lang, darkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!config.items.length || !config.names.length) {
    return (
      <div className="p-12 text-center">
        <p className="text-red-500 font-bold mb-4">يرجى إدخال البنود والأسماء أولاً في شاشة الإعداد.</p>
        <button onClick={onBack} className="bg-primary text-white px-8 py-2 rounded-xl">العودة للإعدادات</button>
      </div>
    );
  }

  const currentItem = config.items[currentIndex];

  const handleScore = (personId: string, val: number) => {
    setScores((prev: any) => ({
      ...prev,
      [`${currentItem.id}_${personId}`]: val
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 p-4 border-b dark:border-gray-700">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <div>
                    <span className="text-xs font-bold text-accent uppercase">{currentItem.sub}</span>
                    <h2 className="text-xl font-black text-gray-800 dark:text-white">{currentIndex + 1}. {currentItem.main}</h2>
                </div>
                <div className="text-sm font-bold text-gray-400">
                    {currentIndex + 1} / {config.items.length}
                </div>
            </div>
        </header>

        <main className="max-w-4xl mx-auto p-6 space-y-4">
            {config.names.map((person: any) => {
                const currentScore = scores[`${currentItem.id}_${person.id}`];
                return (
                    <div key={person.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
                        <div className="flex-1">
                            <h4 className="font-bold text-lg dark:text-gray-100">{person.main}</h4>
                            <span className="text-xs text-gray-500">{person.sub}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {Array.from({length: config.maxScore}, (_, i) => i + 1).map(val => (
                                <button 
                                    key={val}
                                    onClick={() => handleScore(person.id, val)}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all ${currentScore === val ? 'bg-primary text-white shadow-lg ring-4 ring-blue-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-700'}`}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </main>

        <footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 p-6 shadow-2xl border-t dark:border-gray-700">
            <div className="max-w-4xl mx-auto flex justify-between gap-4">
                <button 
                    onClick={() => currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : onBack()}
                    className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-bold rounded-2xl hover:bg-gray-200"
                >
                    {currentIndex === 0 ? 'الإعدادات' : 'السابق'}
                </button>
                <button 
                    onClick={() => currentIndex < config.items.length - 1 ? setCurrentIndex(currentIndex + 1) : onFinish()}
                    className="px-10 py-3 bg-primary text-white font-bold rounded-2xl shadow-xl hover:shadow-primary/40 transition"
                >
                    {currentIndex === config.items.length - 1 ? 'انتهاء' : 'التالي'}
                </button>
            </div>
        </footer>
    </div>
  );
};

export default EvaluationScreen;
