
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIG ---
const supabaseUrl = 'https://nbtuyrieidgqmntvahvn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idHV5cmllaWRncW1udHZhaHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMjY1OTEsImV4cCI6MjA4MzkwMjU5MX0.uUmn7euq4GwygfY54F2z6S3ZEUmUGfoo1D9dMvDhvP0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- COMPONENTS ---

const WelcomeScreen = ({ onStart, lang, setLang }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 text-center">
    <div className="absolute top-6 right-6">
      <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="bg-white/20 px-4 py-2 rounded-full transition backdrop-blur-md">
        {lang === 'ar' ? 'English' : 'عربي'}
      </button>
    </div>
    <div className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl shadow-2xl max-w-2xl border border-white/20">
      <h1 className="text-5xl font-black mb-6 text-yellow-300">نظام التقييم الذكي</h1>
      <p className="text-xl mb-10 leading-relaxed">مرحباً بك في النظام الأكثر دقة وسهولة لإدارة التقييمات وتطوير الأداء.</p>
      <button onClick={onStart} className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-4 px-12 rounded-full text-2xl shadow-xl transition transform hover:scale-105">
        موافق، لنبدأ
      </button>
      <p className="mt-12 text-sm text-blue-200/60">تطوير كمال الخطابي 007781414133</p>
    </div>
  </div>
);

const LoginScreen = ({ onBack }) => {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error) {
      alert('خطأ في تسجيل الدخول: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">تسجيل الدخول</h2>
        <p className="text-gray-600 mb-8 font-medium">سجل في النظام لتستمتع بفترة تجريبية لمدة 15 يوم</p>
        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl hover:bg-gray-50 transition shadow-md">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-6 h-6" />
          <span>الدخول عبر جوجل</span>
        </button>
        <button onClick={onBack} className="mt-6 text-gray-500 hover:underline text-sm font-semibold">العودة للرئيسية</button>
      </div>
    </div>
  );
};

const SetupScreen = ({ profile, onLogout, onComplete, lang, setLang }) => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
      <button onClick={onLogout} className="text-red-500 font-bold">تسجيل الخروج</button>
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-800">{profile?.full_name || 'المستخدم'}</h2>
        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">فترة تجريبية</span>
      </div>
      <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-blue-600 font-bold">{lang === 'ar' ? 'EN' : 'AR'}</button>
    </header>
    <main className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-lg border border-gray-100">
            <h1 className="text-3xl font-bold mb-8 text-blue-800">إعداد التقييم الجديد</h1>
            <p className="text-gray-500 mb-8">يرجى رفع ملفات البيانات أو البدء بالتقييم اليدوي</p>
            <button onClick={onComplete} className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-blue-800">بدء التقييم</button>
        </div>
    </main>
  </div>
);

// --- MAIN APP ---

const App = () => {
  const [screen, setScreen] = useState('welcome');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setProfile({ full_name: session.user.user_metadata.full_name, email: session.user.email });
        setScreen('setup');
      }
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setProfile({ full_name: session.user.user_metadata.full_name, email: session.user.email });
        setScreen('setup');
      } else {
        setProfile(null);
        setScreen('welcome');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-blue-900 text-white font-bold">جاري التحميل...</div>;

  const renderScreen = () => {
    switch (screen) {
      case 'welcome': return <WelcomeScreen onStart={() => setScreen('login')} lang={lang} setLang={setLang} />;
      case 'login': return <LoginScreen onBack={() => setScreen('welcome')} />;
      case 'setup': return <SetupScreen profile={profile} onLogout={() => supabase.auth.signOut()} onComplete={() => alert('تم البدء!')} lang={lang} setLang={setLang} />;
      default: return <WelcomeScreen onStart={() => setScreen('login')} lang={lang} setLang={setLang} />;
    }
  };

  return <div>{renderScreen()}</div>;
};

// --- RENDER ---
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}
