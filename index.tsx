
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
/* Fix: Import XLSX to resolve "Cannot find name 'XLSX'" errors */
import * as XLSX from 'xlsx';

// --- SUPABASE CONFIG ---
const supabaseUrl = 'https://nbtuyrieidgqmntvahvn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idHV5cmllaWRncW1udHZhaHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMjY1OTEsImV4cCI6MjA4MzkwMjU5MX0.uUmn7euq4GwygfY54F2z6S3ZEUmUGfoo1D9dMvDhvP0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- HELPER FUNCTIONS ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- COMPONENTS ---

const WelcomeScreen = ({ onStart, lang, setLang }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 text-center">
    <div className="absolute top-6 right-6">
      <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition backdrop-blur-md">
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
      <button onClick={onStart} className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-4 px-12 rounded-full text-2xl shadow-xl transform transition hover:scale-105 active:scale-95">
        موافق، لنبدأ
      </button>
      <p className="mt-12 text-sm text-blue-200/60 font-medium">تطوير كمال الخطابي 007781414133</p>
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
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 fade-in text-center">
        <div className="mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">تسجيل الدخول</h2>
            <p className="text-gray-600 font-medium">سجل في نظام التقييم لتستمتع بفترة تجريبية لمدة 15 يوم</p>
        </div>
        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl hover:bg-gray-50 transition transform hover:-translate-y-1 shadow-md">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-6 h-6" />
          <span>سجل للمتابعة عبر جوجل</span>
        </button>
        <button onClick={onBack} className="mt-6 text-gray-500 hover:text-gray-700 font-semibold text-sm transition">العودة للرئيسية</button>
      </div>
    </div>
  );
};

const SetupScreen = ({ profile, onLogout, config, setConfig, onComplete, lang, setLang, darkMode, setDarkMode, onResetScores, isDataLocked }) => {
  const [newItem, setNewItem] = useState({ main: '', sub: '' });
  const [newName, setNewName] = useState({ main: '', sub: '' });

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      /* Fix: XLSX is now imported at the top of the file */
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const formatted = data.slice(1).map(row => ({ id: generateId(), main: row[0] || '', sub: row[1] || '' })).filter(r => r.main);
      setConfig(prev => ({ ...prev, [type]: formatted }));
    };
    reader.readAsBinaryString(file);
  };

  const addItem = () => { if (newItem.main) { setConfig(p => ({ ...p, items: [...p.items, { ...newItem, id: generateId() }] })); setNewItem({ main: '', sub: '' }); } };
  const addName = () => { if (newName.main) { setConfig(p => ({ ...p, names: [...p.names, { ...newName, id: generateId() }] })); setNewName({ main: '', sub: '' }); } };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
          <button onClick={onLogout} className="text-red-500 font-bold flex items-center gap-2 text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              تسجيل الخروج
          </button>
          <div className="text-center">
              <h2 className="text-lg font-black text-gray-800 dark:text-white">{profile?.full_name || 'مستخدم النظام'}</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${profile?.is_active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {profile?.is_active ? '✅ مشترك معتمد' : '⏳ فترة تجريبية'}
              </span>
          </div>
          <div className="flex items-center gap-4">
              <button onClick={() => setDarkMode(!darkMode)} className="text-lg">{darkMode ? '🌙' : '☀️'}</button>
              <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-sm font-bold text-blue-600">{lang === 'ar' ? 'EN' : 'AR'}</button>
          </div>
      </header>

      <main className="max-w-5xl mx-auto p-8 space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border dark:border-gray-700 fade-in">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Items Management */}
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2"><span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span> بنود التقييم</h3>
              <div className="flex gap-2">
                <input value={newItem.main} onChange={e => setNewItem({...newItem, main: e.target.value})} placeholder="البند الرئيسي" className="flex-1 p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <input value={newItem.sub} onChange={e => setNewItem({...newItem, sub: e.target.value})} placeholder="وصف" className="flex-1 p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button onClick={addItem} className="bg-blue-600 text-white w-12 rounded-xl">+</button>
              </div>
              <input type="file" onChange={e => handleFileUpload(e, 'items')} className="text-xs text-gray-500" />
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {config.items.map(item => (
                  <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl flex justify-between items-center">
                    <div><p className="font-bold text-sm dark:text-white">{item.main}</p><p className="text-[10px] text-gray-500">{item.sub}</p></div>
                    <button onClick={() => setConfig(p => ({ ...p, items: p.items.filter(i => i.id !== item.id) }))} className="text-red-400">×</button>
                  </div>
                ))}
              </div>
            </section>

            {/* Names Management */}
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-secondary flex items-center gap-2"><span className="bg-teal-100 text-teal-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span> أسماء المقيمين</h3>
              <div className="flex gap-2">
                <input value={newName.main} onChange={e => setNewName({...newName, main: e.target.value})} placeholder="الاسم الكامل" className="flex-1 p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <input value={newName.sub} onChange={e => setNewName({...newName, sub: e.target.value})} placeholder="المسمى الوظيفي" className="flex-1 p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button onClick={addName} className="bg-teal-600 text-white w-12 rounded-xl">+</button>
              </div>
              <input type="file" onChange={e => handleFileUpload(e, 'names')} className="text-xs text-gray-500" />
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {config.names.map(name => (
                  <div key={name.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl flex justify-between items-center">
                    <div><p className="font-bold text-sm dark:text-white">{name.main}</p><p className="text-[10px] text-gray-500">{name.sub}</p></div>
                    <button onClick={() => setConfig(p => ({ ...p, names: p.names.filter(n => n.id !== name.id) }))} className="text-red-400">×</button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t dark:border-gray-700 grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-gray-300 uppercase">الدرجة القصوى</label>
              <input type="number" value={config.maxScore} onChange={e => setConfig({...config, maxScore: parseInt(e.target.value)})} className="w-full p-4 border rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white font-bold text-2xl text-center" />
              {isDataLocked && <button onClick={onResetScores} className="mt-2 text-red-500 text-sm font-bold underline">تصفير الدرجات للتعديل</button>}
            </div>
            <div className="flex items-end">
              <button onClick={onComplete} className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:shadow-2xl transition">بدء التقييم الفعلي</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ... (باقي المكونات EvaluationScreen و ResultsAndAnalysis ستبقى كما هي في نسختك الأصلية) ...

const EvaluationScreen = ({ config, scores, setScores, onFinish, onBack, lang, darkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!config.items.length || !config.names.length) return <div className="p-12 text-center text-red-500 font-bold">يرجى إكمال الإعدادات أولاً!</div>;
  const currentItem = config.items[currentIndex];
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 p-4 border-b dark:border-gray-700">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <div><span className="text-xs font-bold text-orange-500 uppercase">{currentItem.sub}</span><h2 className="text-xl font-black text-gray-800 dark:text-white">{currentIndex + 1}. {currentItem.main}</h2></div>
                <div className="text-sm font-bold text-gray-400">{currentIndex + 1} / {config.items.length}</div>
            </div>
        </header>
        <main className="max-w-4xl mx-auto p-6 space-y-4">
            {config.names.map(person => {
                const currentScore = scores[`${currentItem.id}_${person.id}`];
                return (
                    <div key={person.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1"><h4 className="font-bold text-lg dark:text-gray-100">{person.main}</h4><span className="text-xs text-gray-500">{person.sub}</span></div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {Array.from({length: config.maxScore}, (_, i) => i + 1).map(val => (
                                <button key={val} onClick={() => setScores(p => ({...p, [`${currentItem.id}_${person.id}`]: val}))}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all ${currentScore === val ? 'bg-primary text-white shadow-lg scale-110' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}>
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </main>
        <footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 p-6 shadow-2xl border-t dark:border-gray-700 flex justify-center gap-4">
            <button onClick={() => currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : onBack()} className="px-8 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl font-bold">السابق</button>
            <button onClick={() => currentIndex < config.items.length - 1 ? setCurrentIndex(currentIndex + 1) : onFinish()} className="px-10 py-3 bg-primary text-white font-bold rounded-2xl shadow-xl">{currentIndex === config.items.length - 1 ? 'انتهاء' : 'التالي'}</button>
        </footer>
    </div>
  );
};

const ResultsAndAnalysis = ({ config, scores, onBackToEdit, onGoHome }) => {
  const calculateTotal = (personId) => {
    return config.items.reduce((sum, item) => sum + (scores[`${item.id}_${personId}`] || 0), 0);
  };
  const maxPossible = config.items.length * config.maxScore;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10 no-print">
                <h1 className="text-4xl font-black text-gray-800 dark:text-white">النتائج والتحليل</h1>
                <div className="flex gap-4">
                    <button onClick={onBackToEdit} className="bg-yellow-500 text-white px-6 py-2 rounded-xl font-bold">تعديل</button>
                    <button onClick={onGoHome} className="bg-gray-600 text-white px-6 py-2 rounded-xl font-bold">الرئيسية</button>
                    <button onClick={() => window.print()} className="bg-primary text-white px-6 py-2 rounded-xl font-bold">طباعة</button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="p-6 font-black">الاسم</th>
                            <th className="p-6 font-black">المجموع</th>
                            <th className="p-6 font-black">النسبة</th>
                            <th className="p-6 font-black">التقدير</th>
                        </tr>
                    </thead>
                    <tbody>
                        {config.names.map(n => {
                            const total = calculateTotal(n.id);
                            const percentNum = maxPossible > 0 ? (total / maxPossible) * 100 : 0;
                            const percent = percentNum.toFixed(1);
                            let grade = 'ضعيف';
                            /* Fix: Use percentNum (number) instead of percent (string) for comparison */
                            if (percentNum >= 90) grade = 'ممتاز';
                            else if (percentNum >= 80) grade = 'جيد جداً';
                            else if (percentNum >= 70) grade = 'جيد';
                            
                            return (
                                <tr key={n.id} className="border-t dark:border-gray-700">
                                    <td className="p-6 font-bold">{n.main}</td>
                                    <td className="p-6">{total} / {maxPossible}</td>
                                    <td className="p-6 text-primary font-black">{percent}%</td>
                                    <td className="p-6"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">{grade}</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

const LockScreen = ({ onLogout }) => (
  <div className="fixed inset-0 bg-red-600 flex items-center justify-center p-6 z-[9999] text-white text-center">
    <div className="max-w-md w-full">
      <h1 className="text-4xl font-black mb-4">انتهت الفترة التجريبية</h1>
      <p className="text-xl opacity-90 mb-10">لقد انتهت فترة الـ 15 يوماً. يرجى التواصل لتفعيل الحساب.</p>
      <a href="https://wa.me/967781414133" className="bg-green-500 block py-4 rounded-2xl font-bold mb-4">تواصل عبر واتساب</a>
      <button onClick={onLogout} className="text-white/60 font-bold underline">تسجيل الخروج</button>
    </div>
  </div>
);

// --- MAIN APP ---

const App = () => {
  const [screen, setScreen] = useState('welcome');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({ items: [], names: [], maxScore: 10, orgName: '', evaluatorName: '', logo: null });
  const [scores, setScores] = useState({});
  const [lang, setLang] = useState('ar');
  const [darkMode, setDarkMode] = useState(false);

  const syncProfile = useCallback(async (authUser) => {
    try {
      let { data: p } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
      if (!p) {
        const { data: n } = await supabase.from('profiles').insert([{ id: authUser.id, email: authUser.email, full_name: authUser.user_metadata.full_name || authUser.email.split('@')[0], is_active: false }]).select().single();
        p = n;
      }
      if (p) {
        setProfile(p);
        const diffDays = Math.ceil(Math.abs(new Date().getTime() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 15 && !p.is_active) setIsLocked(true);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); syncProfile(session.user); setScreen('setup'); }
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s?.user) { setUser(s.user); syncProfile(s.user); setScreen('setup'); }
      else { setUser(null); setProfile(null); setIsLocked(false); setScreen('welcome'); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, [syncProfile]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-blue-900 text-white font-bold">جاري التحميل...</div>;
  if (isLocked) return <LockScreen onLogout={() => supabase.auth.signOut()} />;

  const renderScreen = () => {
    switch (screen) {
      case 'welcome': return <WelcomeScreen onStart={() => setScreen('login')} lang={lang} setLang={setLang} />;
      case 'login': return <LoginScreen onBack={() => setScreen('welcome')} />;
      case 'setup': return <SetupScreen profile={profile} onLogout={() => supabase.auth.signOut()} config={config} setConfig={setConfig} onComplete={() => setScreen('eval')} lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode} onResetScores={() => setScores({})} isDataLocked={Object.keys(scores).length > 0} />;
      case 'eval': return <EvaluationScreen config={config} scores={scores} setScores={setScores} onFinish={() => setScreen('results')} onBack={() => setScreen('setup')} lang={lang} darkMode={darkMode} />;
      case 'results': return <ResultsAndAnalysis config={config} scores={scores} onBackToEdit={() => setScreen('eval')} onGoHome={() => setScreen('setup')} />;
      default: return <WelcomeScreen onStart={() => setScreen('login')} lang={lang} setLang={setLang} />;
    }
  };

  return <div className={darkMode ? 'dark' : ''}>{renderScreen()}</div>;
};

// --- RENDER ---
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}
