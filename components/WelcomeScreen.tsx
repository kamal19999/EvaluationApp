
import React from 'react';

interface Props {
  onStart: () => void;
  lang: 'ar' | 'en';
  setLang: (l: 'ar' | 'en') => void;
}

const WelcomeScreen: React.FC<Props> = ({ onStart, lang, setLang }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 text-center">
      <div className="absolute top-6 right-6">
        <button 
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition backdrop-blur-md"
        >
          {lang === 'ar' ? 'English' : 'عربي'}
        </button>
      </div>
      <div className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl shadow-2xl max-w-2xl border border-white/20 fade-in">
        <h1 className="text-5xl font-black mb-6 text-yellow-300 drop-shadow-lg">نظام التقييم الذكي</h1>
        <p className="text-xl mb-10 leading-relaxed text-blue-50">
          مرحباً بك في النظام الأكثر دقة وسهولة لإدارة التقييمات.
          <br />
          يهدف هذا التطبيق لتبسيط عملية الرصد والتحليل للحصول على نتائج دقيقة وقابلة للتطوير.
        </p>
        <button 
          onClick={onStart}
          className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-4 px-12 rounded-full text-2xl shadow-xl transform transition hover:scale-105 active:scale-95"
        >
          موافق، لنبدأ
        </button>
        <p className="mt-12 text-sm text-blue-200/60 font-medium">تطوير كمال الخطابي 007781414133</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
