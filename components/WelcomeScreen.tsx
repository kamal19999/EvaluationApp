import React from 'react';
import { Languages } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  t: (key: string) => string;
  toggleLang: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, t, toggleLang }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary to-blue-900 text-white p-6 text-center relative">
      <div className="absolute top-4 right-4">
        <button onClick={toggleLang} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm transition">
          <Languages className="w-5 h-5" /> English/عربي
        </button>
      </div>
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-2xl border border-white/20 animate-in fade-in duration-700">
        <h1 className="text-4xl font-extrabold mb-6 text-yellow-300 drop-shadow-md">{t('title')}</h1>
        <p className="text-xl mb-8 leading-relaxed text-gray-100 whitespace-pre-line">
          {t('welcome_desc')}
        </p>
        <button 
          onClick={onStart}
          className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-10 rounded-full text-xl shadow-lg transform transition hover:scale-105 active:scale-95"
        >
          {t('start')}
        </button>
        <p className="mt-8 text-xs text-gray-300 opacity-60">{t('dev_by')}</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
