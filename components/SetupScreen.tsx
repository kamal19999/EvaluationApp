import React, { useState } from 'react';
import { Home, Languages, Sun, Moon, HelpCircle, LogOut, CheckCircle, AlertCircle, Upload, XCircle, ArrowLeft } from 'lucide-react';
import { Profile, EvaluationConfig } from '../types';
import * as XLSX from 'xlsx';

interface SetupScreenProps {
  config: EvaluationConfig;
  setConfig: (config: EvaluationConfig) => void;
  onComplete: () => void;
  hasDraft: boolean;
  onLoadDraft: () => void;
  setHasDraft: (val: boolean) => void;
  isLocked: boolean;
  onResetScores: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
  t: (key: string, params?: any) => string;
  toggleLang: () => void;
  profile: Profile | null;
  onLogout: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ 
  config, setConfig, onComplete, hasDraft, onLoadDraft, setHasDraft, 
  isLocked, onResetScores, darkMode, toggleTheme, t, toggleLang, profile, onLogout 
}) => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to parse data (simplified from original SmartParser)
  const processData = (rawData: any[], type: 'items' | 'names') => {
    if (!rawData || rawData.length === 0) return [];
    // Simple logic: assume header is row 0, data starts row 1. 
    // Column 0 = Main (Item/Name), Column 1 = Sub (Domain/Branch)
    // In a real port, SmartParser logic should be fully implemented.
    const data = [];
    for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (row && row[0]) {
            data.push({
                id: i,
                main: String(row[0]).trim(),
                sub: row[1] ? String(row[1]).trim() : (type === 'names' ? 'عام' : 'بدون مجال')
            });
        }
    }
    return data;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'items' | 'names') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const processed = processData(data as any[], type);

        if (processed.length === 0) throw new Error(t('no_data'));

        if (type === 'names') setConfig({ ...config, names: processed });
        else setConfig({ ...config, items: processed });
        setError(null);
      } catch (err) {
        setError(t('file_error', { type: type === 'names' ? t('step2') : t('step1') }));
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setConfig({ ...config, logo: evt.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const validateAndStart = () => {
    if (config.items.length === 0) return setError(t('error_items'));
    if (config.names.length === 0) return setError(t('error_names'));
    if (config.maxScore < 1 || config.maxScore > 10) return setError(t('error_max_score'));
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 fade-in transition-colors duration-300">
      {/* HEADER WITH PROFILE INFO */}
      <div className="bg-white dark:bg-gray-800 shadow-sm p-4 flex flex-wrap gap-4 justify-between items-center border-b dark:border-gray-700">
        <h2 className="text-xl font-bold text-primary dark:text-blue-400 flex items-center gap-2">
           <Home className="w-5 h-5"/> {t('setup_title')}
        </h2>
        
        {/* Profile Info Center */}
        {profile && (
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
                <span className="font-bold text-gray-800 dark:text-gray-100">{profile.full_name}</span>
                {profile.is_active ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full border border-green-200">
                        <CheckCircle className="w-3 h-3"/> مشترك معتمد
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full border border-yellow-200">
                        <AlertCircle className="w-3 h-3"/> فترة تجريبية
                    </span>
                )}
            </div>
        )}

        <div className="flex gap-2">
          <button onClick={toggleLang} className="btn-icon">
            <Languages className="w-4 h-4" /> {t('lang_btn')}
          </button>
          <button onClick={toggleTheme} className="btn-icon">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setHelpOpen(true)} className="btn-icon">
             <HelpCircle className="w-4 h-4" />
          </button>
          <button onClick={onLogout} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50" title="تسجيل الخروج">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        {hasDraft && (
          <div className="bg-blue-50 border border-blue-200 p-4 mb-6 rounded-lg flex flex-wrap gap-4 justify-between items-center shadow-sm">
            <span className="text-blue-800 font-bold">{t('draft_found')}</span>
            <div className="flex gap-2">
              <button onClick={onLoadDraft} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
                <Upload className="w-4 h-4" /> {t('restore_draft')}
              </button>
              <button onClick={() => {localStorage.removeItem('eval_draft'); setHasDraft(false);}} className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 flex items-center gap-2 border border-red-200">
                <XCircle className="w-4 h-4" /> {t('delete_draft')}
              </button>
            </div>
          </div>
        )}

        {error && (
            <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm flex items-center gap-2">
                <AlertCircle /> {error}
            </div>
        )}

        {/* Configuration Steps */}
        <div className="grid md:grid-cols-2 gap-6">
            {/* Step 1: Items */}
            <div className={`p-6 rounded-xl border-2 transition-all ${config.items.length > 0 ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 bg-white'}`}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-gray-800">{t('step1')}</h3>
                    {config.items.length > 0 && <CheckCircle className="text-green-600" />}
                </div>
                <label className="flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 border border-blue-200 transition">
                    <Upload className="w-5 h-5" /> <span className="mx-2">{t('upload_excel')}</span>
                    <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={(e) => handleFileUpload(e, 'items')} />
                </label>
                <p className="text-xs text-gray-500 mt-2">{t('recognized_items', {count: config.items.length})}</p>
            </div>

            {/* Step 2: Names */}
            <div className={`p-6 rounded-xl border-2 transition-all ${config.names.length > 0 ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 bg-white'}`}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-gray-800">{t('step2')}</h3>
                    {config.names.length > 0 && <CheckCircle className="text-green-600" />}
                </div>
                <label className="flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 border border-blue-200 transition">
                    <Upload className="w-5 h-5" /> <span className="mx-2">{t('upload_excel')}</span>
                    <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={(e) => handleFileUpload(e, 'names')} />
                </label>
                <p className="text-xs text-gray-500 mt-2">{t('recognized_names', {count: config.names.length})}</p>
            </div>

            {/* Step 3: Max Score */}
             <div className="md:col-span-2 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg text-gray-800 mb-4">{t('step3')}</h3>
                <div className="flex items-center gap-4">
                    <label className="text-gray-600">{t('max_score')}</label>
                    <input type="number" min="1" max="10" value={config.maxScore} onChange={(e) => setConfig({...config, maxScore: parseInt(e.target.value) || 0})} disabled={isLocked} className="w-20 p-2 border rounded text-center font-bold text-primary" />
                </div>
            </div>

             {/* Step 4: Report Data */}
             <div className="md:col-span-2 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg text-gray-800 mb-4">{t('step4')}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{t('org_name')}</label>
                        <input type="text" value={config.orgName || ''} onChange={(e) => setConfig({...config, orgName: e.target.value})} className="w-full p-2 border rounded" placeholder="مثال: مدرسة المجد" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{t('evaluator_name')}</label>
                        <input type="text" value={config.evaluatorName || ''} onChange={(e) => setConfig({...config, evaluatorName: e.target.value})} className="w-full p-2 border rounded" placeholder="مثال: أ. محمد أحمد" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{t('logo')}</label>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"/>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-8 flex justify-center">
            <button onClick={validateAndStart} className="bg-primary hover:bg-blue-800 text-white font-bold py-3 px-12 rounded-full shadow-lg text-lg flex items-center gap-3 transition-transform hover:scale-105">
                <span>{t('start_eval')}</span> <ArrowLeft />
            </button>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
