
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './services/supabaseClient';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import SetupScreen from './components/SetupScreen';
import EvaluationScreen from './components/EvaluationScreen';
import ResultsAndAnalysis from './components/ResultsAndAnalysis';
import LockScreen from './components/LockScreen';

const App = () => {
  const [screen, setScreen] = useState('welcome');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({ items: [], names: [], maxScore: 10, orgName: '', evaluatorName: '', logo: null });
  const [scores, setScores] = useState({});
  // Fixed type for lang state to match "ar" | "en" union expected by components
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [darkMode, setDarkMode] = useState(false);

  const syncProfile = useCallback(async (authUser) => {
    try {
      let { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authUser.id, 
              email: authUser.email, 
              full_name: authUser.user_metadata.full_name || authUser.email?.split('@')[0],
              is_active: false 
            }
          ])
          .select()
          .single();
        
        if (!createError) existingProfile = newProfile;
      }

      if (existingProfile) {
        setProfile(existingProfile);
        const createdAt = new Date(existingProfile.created_at);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - createdAt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 15 && !existingProfile.is_active) {
          setIsLocked(true);
        } else {
          setIsLocked(false);
        }
      }
    } catch (err) {
      console.error("Error syncing profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await syncProfile(session.user);
        setScreen('setup');
      } else {
        setLoading(false);
      }
    };
    
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await syncProfile(session.user);
        setScreen('setup');
      } else {
        setUser(null);
        setProfile(null);
        setIsLocked(false);
        setScreen('welcome');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [syncProfile]);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-900">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="loader"></div>
          <p className="font-bold animate-pulse">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return <LockScreen onLogout={handleLogout} />;
  }

  const renderScreen = () => {
    switch (screen) {
      case 'welcome': return <WelcomeScreen onStart={() => setScreen('login')} lang={lang} setLang={setLang} />;
      case 'login': return <LoginScreen onBack={() => setScreen('welcome')} />;
      case 'setup': return (
          <SetupScreen 
            profile={profile} onLogout={handleLogout} config={config} setConfig={setConfig} 
            onComplete={() => setScreen('eval')} lang={lang} setLang={setLang}
            darkMode={darkMode} setDarkMode={setDarkMode} onResetScores={() => setScores({})}
            isDataLocked={Object.keys(scores).length > 0}
          />
        );
      case 'eval': return (
          <EvaluationScreen 
            config={config} scores={scores} setScores={setScores}
            onFinish={() => setScreen('results')} onBack={() => setScreen('setup')}
            lang={lang} darkMode={darkMode}
          />
        );
      case 'results': return (
          <ResultsAndAnalysis 
            config={config} scores={scores} onBackToEdit={() => setScreen('eval')} 
            onGoHome={() => setScreen('setup')} lang={lang} darkMode={darkMode}
          />
        );
      default: return <WelcomeScreen onStart={() => setScreen('login')} lang={lang} setLang={setLang} />;
    }
  };

  return <div className={darkMode ? 'dark' : ''}>{renderScreen()}</div>;
};

export default App;
