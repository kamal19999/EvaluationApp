
import React from 'react';

interface Props {
  profile: any;
  onLogout: () => void;
  config: any;
  setConfig: (c: any) => void;
  onComplete: () => void;
  lang: 'ar' | 'en';
  setLang: (l: 'ar' | 'en') => void;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
  onResetScores: () => void;
  isDataLocked: boolean;
}

const SetupScreen: React.FC<Props> = ({ 
  profile, onLogout, config, setConfig, onComplete, 
  lang, setLang, darkMode, setDarkMode, onResetScores, isDataLocked 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Auth Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={onLogout} className="text-red-500 hover:text-red-600 font-bold flex items-center gap-2 text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                تسجيل الخروج
            </button>

            <div className="flex-1 flex flex-col items-center">
                <h2 className="text-xl font-black text-gray-800 dark:text-white">{profile?.full_name || 'مستخدم النظام'}</h2>
                <div className="flex gap-2 mt-1">
                    {profile?.is_active ? (
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <span>✅</span> مشترك معتمد
                        </span>
                    ) : (
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <span>⏳</span> فترة تجريبية
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={() => setDarkMode(!darkMode)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300">
                    {darkMode ? '🌙' : '☀️'}
                </button>
                <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-sm font-bold text-blue-600">
                    {lang === 'ar' ? 'EN' : 'AR'}
                </button>
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 fade-in">
            <h1 className="text-3xl font-bold mb-8 text-primary border-b pb-4">إعداد التقييم</h1>
            
            <div className="space-y-8">
                {/* Manual placeholder logic - reusing structure from previous version */}
                <section>
                    <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">1. البنود</h3>
                    <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                         <p className="text-gray-500 mb-4">ارفع ملف Excel للبنود أو أدخلها يدوياً</p>
                         <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">رفع ملف</button>
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">2. الأسماء</h3>
                    <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                         <p className="text-gray-500 mb-4">ارفع ملف Excel للأسماء أو أدخلها يدوياً</p>
                         <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">رفع ملف</button>
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">3. الدرجة القصوى</h3>
                    <input 
                        type="number" 
                        value={config.maxScore}
                        onChange={(e) => setConfig({...config, maxScore: parseInt(e.target.value)})}
                        disabled={isDataLocked}
                        className="w-full p-4 border rounded-2xl dark:bg-gray-700 dark:border-gray-600 font-bold text-center text-2xl text-blue-600"
                    />
                    {isDataLocked && (
                        <button onClick={onResetScores} className="mt-2 text-red-500 text-sm font-bold underline">تصفير الدرجات المسجلة للتعديل</button>
                    )}
                </section>
                
                <button 
                    onClick={onComplete}
                    className="w-full bg-primary text-white py-5 rounded-3xl font-black text-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
                >
                    بدء التقييم
                </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default SetupScreen;
