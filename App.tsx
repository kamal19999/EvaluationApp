import React, { useState, useEffect } from 'react';
import { supabase, signOut, getOrCreateProfile } from './services/supabaseClient';
import { Profile, EvaluationConfig, Scores, ScreenState } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import SetupScreen from './components/SetupScreen';
import EvaluationScreen from './components/EvaluationScreen';
import ResultsAndAnalysis from './components/ResultsAndAnalysis';
import BlockingScreen from './components/BlockingScreen';
import { Loader2 } from 'lucide-react';

const App = () => {
  const [screen, setScreen] = useState<ScreenState>('loading');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // App Data State
  const [config, setConfig] = useState<EvaluationConfig>({ items: [], names: [], maxScore: 10, orgName: '', evaluatorName: '', logo: null });
  const [scores, setScores] = useState<Scores>({});
  const [hasDraft, setHasDraft] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState('ar');

  // Translations dictionary
  const translations: any = {
    ar: {
        title: "نظام التقييم الذكي",
        welcome_desc: "مرحباً بك في النظام الأكثر دقة وسهولة لإدارة التقييمات.\nيهدف هذا التطبيق لتبسيط عملية الرصد والتحليل للحصول على نتائج دقيقة وقابلة للتطوير.",
        start: "موافق، لنبدأ",
        dev_by: "تطوير كمال الخطابي 007781414133",
        setup_title: "إعداد التقييم",
        step1: "1. البنود",
        step2: "2. الأسماء",
        step3: "3. إعدادات الدرجات",
        step4: "4. بيانات التقرير (اختياري)",
        upload_excel: "رفع ملف Excel",
        manual_entry: "أو يمكنك الادخال يدوياً في هذا الجدول:",
        recognized_items: "تم التعرف على: {count} بند",
        recognized_names: "تم التعرف على: {count} اسم",
        max_score: "الدرجة القصوى:",
        reset_scores: "تصفير النتائج",
        org_name: "اسم الجهة",
        evaluator_name: "اسم معد التقييم",
        logo: "شعار الجهة",
        start_eval: "ابدأ التقييم",
        help_guide: "دليل الاستخدام",
        help_text: "قم برفع ملف البنود وملف الأسماء.\nيدعم النظام قراءة ملفات Excel حتى لو كانت العناوين مختلفة قليلاً.\nاستخدم زر \"حفظ المسودة\" للحفاظ على عملك في حال انقطاع الانترنت أو إغلاق المتصفح.",
        draft_found: "يوجد تقييم محفوظ سابقاً (مسودة)، هل تريد استكماله؟",
        restore_draft: "استرجاع المسودة",
        delete_draft: "حذف المسودة",
        domain: "المجال",
        save_draft: "حفظ مسودة",
        apply_all: "تطبيق على الكل",
        reset_item: "تصفير البند الحالي",
        cancel_return: "إلغاء وعودة",
        prev: "السابق",
        next: "التالي",
        finish: "انتهاء التقييم",
        settings: "الإعدادات",
        missing_alert: "يرجى تقييم جميع الأسماء قبل الانتقال!",
        note_placeholder: "اكتب ملاحظات عامة حول هذا الشخص...",
        results_title: "النتائج التفصيلية",
        analysis_title: "التحليل والمؤشرات",
        table_view: "الجــدول",
        analysis_view: "لوحة التحليل",
        edit_eval: "تعديل التقييم",
        home: "الرئيسية",
        export_options: "خيارات التصدير:",
        export_excel: "Excel",
        export_pdf_table: "PDF (جدول)",
        export_cards: "تصدير البطاقات (PDF)",
        export_report: "تصدير التقرير الكامل",
        filter_search: "تصفية وبحث:",
        search_placeholder: "بحث بالاسم...",
        branch: "الفرع",
        all: "الكل",
        rating: "التقدير",
        cancel_filter: "إلغاء التصفية",
        show_sums: "إظهار المجاميع",
        hide_sums: "إخفاء المجاميع",
        total: "المجموع",
        percent: "%",
        name_col: "الاسم",
        sum_domain: "مجموع {domain}",
        general_percent: "النسبة العامة",
        total_points: "مجموع النقاط",
        general_notes: "ملاحظات عامة",
        kpi_count: "العدد",
        kpi_avg: "متوسط الأداء العام",
        kpi_names: "مؤشرات الأسماء",
        kpi_branches: "مؤشرات الفروع",
        kpi_domains: "مؤشرات المجالات",
        kpi_items: "مؤشرات البنود",
        best: "الأفضل",
        worst: "الأدنى",
        chart_branch: "أداء الفروع",
        chart_domain: "أداء المجالات",
        chart_items: "أداء البنود",
        chart_names: "أداء الأسماء",
        chart_rating: "توزيع التقديرات",
        item_analysis: "تحليل البنود التفصيلي",
        name_comparison: "مقارنة الأسماء",
        export_pdf_btn: "تصدير PDF",
        add_row: "إضافة صف جديد",
        delete_confirm: "هل أنت متأكد؟",
        warning: "تحذير",
        na: "غ/م",
        items_legend: "دليل البنود:",
        page: "صفحة",
        of: "من",
        save_hint: "احفظ جهدك كمسودة",
        apply_all_prompt: "أدخل الدرجة لتعميمها على الجميع (1-{max}) أو -1 لـ (غ/م):",
        invalid_val: "قيمة غير صحيحة",
        reset_confirm: "هل أنت متأكد من تصفير جميع الاختيارات لهذا البند؟",
        cancel_confirm: "هل أنت متأكد من إلغاء التقييم والعودة للبداية؟ ستفقد البيانات غير المحفوظة.",
        delete_draft_confirm: "هل أنت متأكد من حذف المسودة المحفوظة؟ لا يمكن التراجع عن هذا الإجراء.",
        reset_scores_confirm: "تحذير هام: سيتم حذف جميع الدرجات التي تم رصدها حتى الآن للسماح لك بتعديل الدرجة القصوى.\n\nهل أنت متأكد من رغبتك في تصفير النتائج؟",
        error_items: "يجب رفع ملف البنود أولاً",
        error_names: "يجب رفع ملف الأسماء أولاً",
        error_max_score: "الدرجة القصوى يجب أن تكون بين 1 و 10",
        file_error: "خطأ في قراءة ملف {type}. تأكد من صحة الملف.",
        no_data: "لم يتم العثور على بيانات صالحة",
        item_label: "البند",
        domain_label: "المجال (اختياري)",
        name_label: "الاسم",
        branch_label: "الفرع (اختياري)",
        lang_btn: "English",
        count_unit: "عنصر",
        visible_items: "للعناصر الظاهرة",
        report_date: "التاريخ:",
        report_prep: "إعداد:",
        report_title_default: "تقرير التقييم",
        detailed_results_title: "النتائج التفصيلية لتقييم الموظفين",
        excellent: "ممتاز",
        very_good: "جيد جداً",
        good: "جيد",
        acceptable: "مقبول",
        weak: "ضعيف"
    },
    en: {
        title: "Smart Evaluation System",
        welcome_desc: "Welcome to the most accurate and easy-to-use evaluation management system.\nThis app aims to simplify tracking and analysis for accurate and scalable results.",
        start: "OK, Let's Start",
        dev_by: "Developed by Kamal Al-Khattabi 007781414133",
        lang_btn: "عربي",
    }
  };

  const t = (key: string, params: Record<string, any> = {}) => {
    let text = translations[lang][key] || key;
    if (!translations[lang][key] && lang === 'en') text = translations['ar'][key] || key; 
    Object.keys(params).forEach(k => {
      text = text.replace(`{${k}}`, params[k]);
    });
    return text;
  };

  const toggleLang = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');
  const toggleTheme = () => setDarkMode(!darkMode);

  // Auth & Profile Check Effect
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        // Fetch or create profile
        const userProfile = await getOrCreateProfile(
          session.user.id, 
          session.user.email || '', 
          session.user.user_metadata.full_name || 'Unknown'
        );
        
        setProfile(userProfile);

        if (userProfile) {
            // Check Locking Logic (15 Days Trial)
            const createdAt = new Date(userProfile.created_at).getTime();
            const now = new Date().getTime();
            const daysSinceCreation = (now - createdAt) / (1000 * 3600 * 24);

            if (daysSinceCreation > 15 && !userProfile.is_active) {
                setScreen('blocked');
            } else {
                // Determine destination
                if (screen === 'loading' || screen === 'welcome' || screen === 'login') {
                    setScreen('setup');
                }
            }
        } else {
            // Error creating profile, go back to welcome
            await signOut();
            setScreen('welcome');
        }
      } else {
        // No user logged in
        if (screen === 'loading') setScreen('welcome');
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
         if (!user) checkUser(); 
      } else {
        setUser(null);
        setProfile(null);
        setScreen('welcome');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Theme & Dir effects
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Draft Logic
  useEffect(() => {
    const draft = localStorage.getItem('eval_draft');
    if(draft) setHasDraft(true);
  }, []);

  const saveDraft = (currentScores: Scores) => {
    setScores(currentScores);
    const data = { config, scores: currentScores, date: new Date().toISOString() };
    localStorage.setItem('eval_draft', JSON.stringify(data));
    setHasDraft(true);
  };

  const loadDraft = () => {
    const draft = localStorage.getItem('eval_draft');
    if(draft) {
      const data = JSON.parse(draft);
      setConfig(data.config);
      setScores(data.scores);
      setScreen('eval');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setScreen('welcome');
  };

  const renderScreen = () => {
    switch(screen) {
      case 'loading': 
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-12 h-12 animate-spin text-primary"/></div>;
      case 'welcome': 
        return <WelcomeScreen onStart={() => setScreen('login')} t={t} toggleLang={toggleLang} />;
      case 'login':
        return <LoginScreen onBack={() => setScreen('welcome')} />;
      case 'blocked':
        return <BlockingScreen />;
      case 'setup': 
        return <SetupScreen 
          config={config} 
          setConfig={setConfig} 
          onComplete={() => setScreen('eval')} 
          hasDraft={hasDraft} 
          onLoadDraft={loadDraft} 
          setHasDraft={setHasDraft} 
          isLocked={Object.keys(scores).length > 0} 
          onResetScores={() => setScores({})} 
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
          t={t} 
          toggleLang={toggleLang}
          profile={profile}
          onLogout={handleLogout}
        />;
      case 'eval': 
        return <EvaluationScreen 
          config={config} 
          initialScores={scores} 
          onFinish={(finalScores: any) => { setScores(finalScores); setScreen('results'); }} 
          onSaveDraft={saveDraft} 
          onCancel={() => setScreen('setup')} 
          onBackToSetup={() => setScreen('setup')} 
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
          t={t} 
          toggleLang={toggleLang} 
        />;
      case 'results': 
        return <ResultsAndAnalysis 
          config={config} 
          scores={scores} 
          onBackToEdit={() => setScreen('eval')} 
          onGoHome={() => setScreen('setup')} 
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
          t={t} 
          toggleLang={toggleLang} 
          lang={lang} 
        />;
      default: 
        return <WelcomeScreen onStart={() => setScreen('login')} t={t} toggleLang={toggleLang} />;
    }
  };

  return (
    <div className={`font-sans text-right`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {renderScreen()}
    </div>
  );
};

export default App;