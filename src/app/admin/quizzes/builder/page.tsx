'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Plus, Trash2, CheckCircle, Save, 
  Settings, BookOpen, Clock, Target, Sigma, AlertTriangle, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

import { createQuiz, updateQuiz, getQuiz, QuizQuestion, QuizPayload } from '@/services/quizzes';
import { getAllResources } from '@/services/resource';
import { Resource } from '@/types/resource';
import DebugConsole from '@/components/debug/DebugConsole';

const SYMBOL_LIBRARY = [
  '+', '-', '×', '÷', '±', '=', '≈', '≠', '<', '>', '≤', '≥', '∞', '∝',
  '½', '⅓', '⅔', '¼', '¾', '²', '³', 'ⁿ', '₀', '₁', '₂', '₃',
  'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'ρ', 'σ', 'τ', 'φ', 'ω',
  'Δ', 'Σ', 'Ω', '∈', '∉', '⊂', '⊃', '∪', '∩', '∅',
  '∫', '∬', '∇', '∂', '√', '∛', '∠', '°', '∴', '∵', '⊥', '∥', '→', '←', '℃', '℉'
];

const emptyQuestion = (order: number): QuizQuestion => ({
  text: '',
  marks_positive: 1,
  marks_negative: 0,
  order,
  options: [
    { text: '', is_correct: true },
    { text: '', is_correct: false },
  ],
});

type SymbolTarget = { qIndex: number; isOption: boolean; oIndex?: number };

export default function QuizBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id');

  const [resourceId, setResourceId] = useState<number | string>('');
  const [passingScore, setPassingScore] = useState<number>(40);
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<any>(null);
  const [saveError, setSaveError] = useState<any>(null);

  const [symbolTarget, setSymbolTarget] = useState<SymbolTarget | null>(null);

  const init = async () => {
    try {
      setLoading(true);
      setError(null);
      const resources = await getAllResources();
      setAvailableResources(resources);

      if (quizId) {
        const existingQuiz = await getQuiz(Number(quizId));
        setResourceId(existingQuiz.resource);
        setPassingScore(existingQuiz.passing_score_percentage);
        setTimeLimit(existingQuiz.time_limit_minutes);
        setQuestions(existingQuiz.questions.length ? existingQuiz.questions : [emptyQuestion(0)]);
      } else {
        setQuestions([emptyQuestion(0)]);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, [quizId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && symbolTarget) {
        setSymbolTarget(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [symbolTarget]);

  const resourceOptions = useMemo(
    () => availableResources.map((res) => ({
        id: res.id,
        label: `${res.node_name || 'Unknown Topic'} • ${res.title}`,
      })),
    [availableResources]
  );

  const handleAddQuestion = () => setQuestions((prev) => [...prev, emptyQuestion(prev.length)]);
  
  const handleRemoveQuestion = (qIndex: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== qIndex).map((q, i) => ({ ...q, order: i })));
    setSymbolTarget(null); 
  };

  const handleQuestionChange = (qIndex: number, field: keyof QuizQuestion, value: any) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = { ...updated[qIndex], [field]: value };
      return updated;
    });
  };

  const insertSymbol = (symbol: string) => {
    if (!symbolTarget) return;
    const { qIndex, isOption, oIndex } = symbolTarget;

    setQuestions((prev) => {
      const updated = [...prev];
      const qToUpdate = { ...updated[qIndex] };

      if (!isOption) {
        qToUpdate.text = qToUpdate.text + symbol;
      } else if (oIndex !== undefined) {
        const newOptions = [...qToUpdate.options];
        newOptions[oIndex] = { ...newOptions[oIndex], text: newOptions[oIndex].text + symbol };
        qToUpdate.options = newOptions;
      }

      updated[qIndex] = qToUpdate;
      return updated;
    });
    
    setSymbolTarget(null);
  };

  const handleAddOption = (qIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const qToUpdate = { ...updated[qIndex] };
      qToUpdate.options = [...qToUpdate.options, { text: '', is_correct: false }];
      updated[qIndex] = qToUpdate;
      return updated;
    });
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const qToUpdate = { ...updated[qIndex] };
      const newOptions = qToUpdate.options.filter((_, i) => i !== oIndex);
      
      if (qToUpdate.options[oIndex].is_correct && newOptions.length > 0) {
        newOptions[0].is_correct = true;
      }
      qToUpdate.options = newOptions;
      updated[qIndex] = qToUpdate;
      return updated;
    });
    setSymbolTarget(null);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const qToUpdate = { ...updated[qIndex] };
      const newOptions = [...qToUpdate.options];
      newOptions[oIndex] = { ...newOptions[oIndex], text };
      qToUpdate.options = newOptions;
      updated[qIndex] = qToUpdate;
      return updated;
    });
  };

  const handleSetCorrectOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const qToUpdate = { ...updated[qIndex] };
      qToUpdate.options = qToUpdate.options.map((opt, idx) => ({ 
        ...opt, 
        is_correct: idx === oIndex 
      }));
      updated[qIndex] = qToUpdate;
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!resourceId) return setSaveError({ message: 'Please select a topic/resource to attach this quiz to.' });
    if (questions.length === 0) return setSaveError({ message: 'You must add at least one question.' });

    const invalidQuestion = questions.find((q) => q.options.length < 2 || !q.options.some((o) => o.is_correct) || !q.text.trim());
    if (invalidQuestion) {
      return setSaveError({ message: 'Each question needs text, minimum 2 options, and exactly 1 correct option selected.' });
    }

    setSaving(true);
    setSaveError(null);

    const payload: QuizPayload = {
      resource: Number(resourceId),
      passing_score_percentage: passingScore,
      time_limit_minutes: timeLimit,
      questions,
    };

    try {
      if (quizId) await updateQuiz(Number(quizId), payload);
      else await createQuiz(payload);
      router.push('/admin/quizzes');
    } catch (err: any) {
      setSaveError(err);
    } finally {
      setSaving(false);
    }
  };

  const renderSymbolToolbar = (targetMatch: boolean) => {
    if (!targetMatch) return null;
    return (
      <div className="mt-3 p-3 bg-slate-900/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl flex flex-wrap gap-1.5 animate-in fade-in zoom-in-95 shadow-2xl shadow-slate-900/20 border border-slate-700 relative z-20">
        {SYMBOL_LIBRARY.map(sym => (
          <button 
            key={sym} 
            onClick={() => insertSymbol(sym)}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-200 hover:bg-indigo-600 hover:text-white rounded-xl text-sm sm:text-base font-black transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {sym}
          </button>
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin" />
      <p className="font-bold tracking-widest uppercase text-xs sm:text-sm animate-pulse">Initializing Builder...</p>
    </div>
  );

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" /> Builder Exception
          </h1>
          <button 
            onClick={init}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5" /> Retry Initialization
          </button>
        </div>
        <DebugConsole error={error} />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 pb-24">
      
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm px-4 py-4 md:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link href="/admin/quizzes" className="p-2 sm:p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate tracking-tight">
                {quizId ? 'Edit Assessment' : 'Construct Assessment'}
              </h1>
            </div>
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={saving} 
            className="px-6 py-3 sm:py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl flex items-center justify-center gap-2.5 shrink-0 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-600/30 dark:focus:ring-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span className="hidden sm:inline">{saving ? 'Processing...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        
        {saveError && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4">
             <DebugConsole error={saveError} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-col-reverse">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm lg:sticky lg:top-28">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Parameters</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5 ml-1">
                    <BookOpen className="w-4 h-4" /> Link to Resource
                  </label>
                  <select
                    value={resourceId}
                    onChange={(e) => setResourceId(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select target node...</option>
                    {resourceOptions.map((res) => (
                      <option key={res.id} value={res.id}>{res.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5 ml-1">
                      <Target className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Passing (%)
                    </label>
                    <input 
                      type="number" min="1" max="100" 
                      value={passingScore} 
                      onChange={(e) => setPassingScore(Number(e.target.value))} 
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-black text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5 ml-1">
                      <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Time (Min)
                    </label>
                    <input 
                      type="number" min="1" 
                      value={timeLimit} 
                      onChange={(e) => setTimeLimit(Number(e.target.value))} 
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-black text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Structure <span className="inline-flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 h-8 px-3 rounded-xl text-sm ml-3 border border-indigo-200 dark:border-indigo-800/50">{questions.length} blocks</span>
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-300 dark:focus-within:border-indigo-700 transition-all">
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 font-black text-slate-900 dark:text-white text-lg">
                      <span className="bg-indigo-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm sm:text-base shadow-md shadow-indigo-600/20">
                        {qIndex + 1}
                      </span>
                      Question Block
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-1.5 shadow-sm text-sm">
                        <span className="pl-3 pr-2 text-emerald-600 dark:text-emerald-400 font-black">+</span>
                        <input 
                          type="number" step="0.5" 
                          value={q.marks_positive} 
                          onChange={(e) => handleQuestionChange(qIndex, 'marks_positive', Number(e.target.value))} 
                          className="w-12 sm:w-14 text-center font-bold text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800 rounded-md py-1 transition-colors" 
                          title="Positive Marks"
                        />
                        <span className="px-2 text-slate-300 dark:text-slate-600">|</span>
                        <span className="pr-2 text-rose-500 dark:text-rose-400 font-black">-</span>
                        <input 
                          type="number" step="0.25" 
                          value={q.marks_negative} 
                          onChange={(e) => handleQuestionChange(qIndex, 'marks_negative', Number(e.target.value))} 
                          className="w-12 sm:w-14 text-center font-bold text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800 rounded-md py-1 transition-colors" 
                          title="Negative Penalty"
                        />
                      </div>
                      <button 
                        onClick={() => handleRemoveQuestion(qIndex)} 
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 dark:hover:border-rose-800/50 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500" 
                        title="Delete Question Block"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                    <div>
                      <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
                        <label className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Question Prompt</label>
                        <button 
                          onClick={() => setSymbolTarget(
                            symbolTarget?.qIndex === qIndex && !symbolTarget.isOption 
                              ? null 
                              : { qIndex, isOption: false }
                          )}
                          className={`text-xs font-bold flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${symbolTarget?.qIndex === qIndex && !symbolTarget.isOption ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                          <Sigma className="w-4 h-4" /> Insert Symbol
                        </button>
                      </div>

                      <textarea 
                        value={q.text} 
                        onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} 
                        placeholder="Draft the question text here..." 
                        rows={3} 
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base sm:text-lg" 
                      />
                      {renderSymbolToolbar(symbolTarget?.qIndex === qIndex && !symbolTarget.isOption)}
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 ml-1 block">Answer Variations</label>
                      <div className="space-y-3 sm:space-y-4">
                        {q.options.map((opt, oIndex) => {
                          const isCorrect = opt.is_correct;
                          return (
                            <div key={oIndex} className={`flex flex-col gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all focus-within:ring-4 ${isCorrect ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-400 dark:border-emerald-600 shadow-md focus-within:ring-emerald-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 focus-within:border-indigo-400 dark:focus-within:border-indigo-600 focus-within:ring-indigo-500/10'}`}>
                              <div className="flex items-start md:items-center gap-3 sm:gap-4">
                                <button 
                                  onClick={() => handleSetCorrectOption(qIndex, oIndex)} 
                                  className={`mt-3 sm:mt-0 shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-xl flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${isCorrect ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105 focus:ring-emerald-500' : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 focus:ring-slate-400'}`}
                                  title="Mark as correct answer"
                                >
                                  {isCorrect && <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
                                </button>
                                
                                <textarea 
                                  value={opt.text} 
                                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} 
                                  placeholder={`Option Variation ${oIndex + 1}`} 
                                  rows={1}
                                  className={`flex-1 min-w-0 bg-transparent border-0 p-2 sm:p-3 focus:ring-0 resize-none font-bold placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none text-sm sm:text-base ${isCorrect ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-700 dark:text-slate-200'}`} 
                                />
                                
                                <div className="flex items-center gap-1.5 shrink-0 mt-2 sm:mt-0">
                                  <button 
                                    onClick={() => setSymbolTarget(
                                      symbolTarget?.qIndex === qIndex && symbolTarget.isOption && symbolTarget.oIndex === oIndex 
                                        ? null 
                                        : { qIndex, isOption: true, oIndex }
                                    )}
                                    className={`p-2.5 sm:p-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${symbolTarget?.qIndex === qIndex && symbolTarget.isOption && symbolTarget.oIndex === oIndex ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
                                    title="Insert Math/Greek Symbol"
                                  >
                                    <Sigma className="w-4 h-4 sm:w-5 sm:h-5" />
                                  </button>
                                  <button 
                                    onClick={() => handleRemoveOption(qIndex, oIndex)} 
                                    disabled={q.options.length <= 2}
                                    className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-900/30 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    title="Remove Option"
                                  >
                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                  </button>
                                </div>
                              </div>
                              
                              {renderSymbolToolbar(symbolTarget?.qIndex === qIndex && symbolTarget.isOption && symbolTarget.oIndex === oIndex)}
                            </div>
                          );
                        })}
                      </div>

                      <button 
                        onClick={() => handleAddOption(qIndex)} 
                        className="mt-4 sm:mt-5 text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                      >
                        <Plus className="w-5 h-5" /> Expand Options
                      </button>
                    </div>

                  </div>
                </div>
              ))}

              <button 
                onClick={handleAddQuestion} 
                className="w-full py-10 sm:py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-indigo-300 dark:group-hover:border-indigo-500 rounded-2xl flex items-center justify-center transition-colors group-hover:scale-110 duration-300">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <span className="font-black text-base sm:text-lg tracking-tight">Add Question Block</span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}