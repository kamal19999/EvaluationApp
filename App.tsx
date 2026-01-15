
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './services/supabaseClient';
import { User } from '@supabase/supabase-js';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import SetupScreen from './components/SetupScreen';
import EvaluationScreen from './components/EvaluationScreen';
import ResultsAndAnalysis from './components/ResultsAndAnalysis';
import LockScreen from './components/LockScreen';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<'welcome' | 'login' | 'setup' | 'eval' | 'results'>('welcome');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [config, setConfig] = useState({ items: [], names: [], maxScore: 10, orgName: '', evaluatorName: '', logo: null });
  const [scores, setScores] = useState<Record<string, any>>({});
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [darkMode, setDarkMode] = useState(false);

  // Sync Profile and Subscription Logic
  const checkSubscription = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    
    const createdAt = new Date(data.created_at);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 15 && !data.is_active) {
      setIsLocked(true);
    } else {
      setIsLocked(false);
    }
    
    setProfile(data);
    return data;
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        checkSubscription(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSubscription(session.user.id);
        if (screen === 'login') setScreen('setup');
      } else {
        setScreen('welcome');
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkSubscription]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setScreen('welcome');
  };

  if (isLocked) {
    return <LockScreen onLogout={handleLogout} />;
  }

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setScreen('login')} lang={lang} setLang={setLang} />;
      case 'login':
        return <LoginScreen onBack={() => setScreen('welcome')} />;
      case 'setup':
        return (
          <SetupScreen 
            profile={profile}
            onLogout={handleLogout}
            config={config} 
            setConfig={setConfig} 
            onComplete={() => setScreen('eval')}
            lang={lang}
            setLang={setLang}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onResetScores={() => setScores({})}
            isDataLocked={Object.keys(scores).length > 0}
          />
        );
      case 'eval':
        return (
          <EvaluationScreen 
            config={config} 
            scores={scores} 
            setScores={setScores}
            onFinish={() => setScreen('results')} 
            onBack={() => setScreen('setup')}
            lang={lang}
            darkMode={darkMode}
          />
        );
      case 'results':
        return (
          <ResultsAndAnalysis 
            config={config} 
            scores={scores} 
            onBackToEdit={() => setScreen('eval')} 
            onGoHome={() => setScreen('setup')}
            lang={lang}
            darkMode={darkMode}
          />
        );
      default:
        return <WelcomeScreen onStart={() => setScreen('login')} lang={lang} setLang={setLang} />;
    }
  };

  return <div className={darkMode ? 'dark' : ''}>{renderScreen()}</div>;
};

export default App;
