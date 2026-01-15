import React, { useState, useMemo } from 'react';
import { EvaluationConfig, Scores } from '../types';
import { Languages, Sun, Moon, Save, RefreshCw, XCircle, ArrowLeft, ArrowRight, Wand2, MessageSquare } from 'lucide-react';

// NOTE: This component logic closely mirrors the provided HTML `EvaluationScreen`
// Adapted for TypeScript and separate file structure.

interface EvaluationScreenProps {
    config: EvaluationConfig;
    initialScores: Scores;
    onFinish: (scores: Scores) => void;
    onSaveDraft: (scores: Scores) => void;
    onCancel: () => void;
    onBackToSetup: () => void;
    darkMode: boolean;
    toggleTheme: () => void;
    t: (key: string, params?: any) => string;
    toggleLang: () => void;
}

const EvaluationScreen: React.FC<EvaluationScreenProps> = ({ 
    config, initialScores, onFinish, onSaveDraft, onCancel, onBackToSetup, darkMode, toggleTheme, t, toggleLang 
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scores, setScores] = useState<Scores>(initialScores || {}); 
    const [showMissing, setShowMissing] = useState(false);
    const [openNoteId, setOpenNoteId] = useState<number | null>(null);

    const currentItem = config.items[currentIndex];
    
    // Ensure we have an item to render
    if (!currentItem) return <div>Error: No items found</div>;

    const domains = useMemo(() => {
        const d: string[] = [];
        config.items.forEach(item => { if(!d.includes(item.sub)) d.push(item.sub); });
        return d;
    }, [config.items]);
    const currentDomainIndex = domains.indexOf(currentItem.sub);

    const handleScore = (nameId: number, val: number) => {
        setScores(prev => ({...prev, [`${currentItem.id}_${nameId}`]: val}));
    };

    const handleNote = (nameId: number, text: string) => {
        setScores(prev => ({...prev, [`note_${nameId}`]: text}));
    };

    const isAllRated = () => config.names.every(n => scores[`${currentItem.id}_${n.id}`] !== undefined);

    const handleNext = () => {
        if (!isAllRated()) { setShowMissing(true); window.scrollTo(0, 0); return; }
        setShowMissing(false);
        if (currentIndex < config.items.length - 1) { setCurrentIndex(prev => prev + 1); window.scrollTo(0, 0); }
        else { onFinish(scores); }
    };

    const handlePrev = () => { 
        if (currentIndex > 0) { 
            setCurrentIndex(prev => prev - 1); window.scrollTo(0, 0); 
        } else {
            onBackToSetup();
        }
    };
    
    const progress = config.items.length > 1 ? (currentIndex / (config.items.length - 1)) * 100 : 100;

    const handleApplyAll = () => {
        const input = prompt(t('apply_all_prompt', {max: config.maxScore}), String(config.maxScore));
        if (input === null) return;
        const val = parseInt(input);
        
        if (isNaN(val) || ((val < 1 || val > config.maxScore) && val !== -1)) {
            alert(t('invalid_val'));
            return;
        }

        setScores(prev => {
            const newScores = { ...prev };
            config.names.forEach(person => {
                newScores[`${currentItem.id}_${person.id}`] = val;
            });
            return newScores;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 fade-in">
             <div className="fixed top-0 left-0 w-full h-2 bg-gray-200 z-50">
                <div className={`h-full transition-all duration-500 ${currentIndex === config.items.length - 1 ? 'bg-green-600' : 'bg-teal-600'}`} style={{width: `${progress}%`}}></div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto max-w-5xl p-4 flex justify-between items-center relative">
                    <div>
                        <div className="text-sm font-semibold text-orange-600 uppercase tracking-wider">
                            {t('domain')} {currentDomainIndex + 1}: {currentItem.sub}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{currentIndex + 1}. {currentItem.main}</h2>
                    </div>
                    <div className="flex gap-2 items-center">
                         <button onClick={() => onSaveDraft(scores)} className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"><Save className="w-5 h-5"/></button>
                         <button onClick={handleApplyAll} className="p-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"><Wand2 className="w-5 h-5"/></button>
                         <button onClick={onCancel} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200"><XCircle className="w-5 h-5"/></button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl p-4 mt-4">
                 {showMissing && !isAllRated() && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-center font-bold border border-red-200 animate-pulse">
                        {t('missing_alert')}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                    {config.names.map((person) => {
                        const scoreKey = `${currentItem.id}_${person.id}`;
                        const currentScore = scores[scoreKey] as number;
                        const isMissing = showMissing && currentScore === undefined;
                        const noteKey = `note_${person.id}`;
                        const currentNote = scores[noteKey] || '';

                        return (
                            <div key={person.id} className={`border-b dark:border-gray-700 last:border-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${isMissing ? 'bg-red-50 border-l-4 border-l-red-500' : ''}`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{person.main}</h4>
                                            <button onClick={() => setOpenNoteId(openNoteId === person.id ? null : person.id)} className={`p-1 rounded-full ${currentNote ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:text-gray-600'}`}>
                                                <MessageSquare className="w-4 h-4"/>
                                            </button>
                                        </div>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1 inline-block">{person.sub}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 justify-center md:justify-end">
                                        <button onClick={() => handleScore(person.id, -1)} className={`h-10 px-3 rounded-lg font-bold text-xs transition-all border ${currentScore === -1 ? 'bg-gray-600 text-white border-gray-600' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'}`}>{t('na')}</button>
                                        {Array.from({length: config.maxScore}, (_, i) => i + 1).map(val => (
                                            <button key={val} onClick={() => handleScore(person.id, val)} className={`w-10 h-10 rounded-lg font-bold text-sm transition-all transform hover:scale-110 ${currentScore === val ? 'bg-primary text-white shadow-lg ring-2 ring-blue-300' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>{val}</button>
                                        ))}
                                    </div>
                                </div>
                                {openNoteId === person.id && (
                                    <div className="mt-3 fade-in">
                                        <textarea 
                                            value={currentNote as string}
                                            onChange={(e) => handleNote(person.id, e.target.value)}
                                            placeholder={t('note_placeholder')}
                                            className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none bg-yellow-50"
                                            rows={2}
                                        ></textarea>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 border-t dark:border-gray-700">
                <div className="container mx-auto max-w-5xl flex justify-between items-center relative">
                    <button onClick={handlePrev} className={`flex items-center gap-2 px-8 py-3 rounded-full shadow-lg font-bold transition-transform active:scale-95 bg-gray-600 hover:bg-gray-700 text-white`}>
                        <ArrowRight className="w-4 h-4" /> {currentIndex === 0 ? t('settings') : t('prev')}
                    </button>
                    <button onClick={handleNext} className={`flex items-center gap-2 px-8 py-3 text-white rounded-full shadow-lg font-bold transition-transform active:scale-95 ${currentIndex === config.items.length - 1 ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-blue-800'}`}>
                        {currentIndex === config.items.length - 1 ? t('finish') : t('next')} {currentIndex < config.items.length - 1 && <ArrowLeft className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EvaluationScreen;
