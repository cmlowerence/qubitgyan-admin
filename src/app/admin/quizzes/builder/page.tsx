'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Plus, Trash2, CheckCircle, Save, 
  Settings, BookOpen, Clock, Target, Sigma
} from 'lucide-react';
import Link from 'next/link';

import { createQuiz, updateQuiz, getQuiz, QuizQuestion, QuizPayload } from '@/services/quizzes';
import { getAllResources } from '@/services/resource';
import { Resource } from '@/types/resource';

// --- Expanded Symbol Library ---
const SYMBOL_LIBRARY = [
  // Basic Math & Operators
  '+', '-', '×', '÷', '±', '=', '≈', '≠', '<', '>', '≤', '≥', '∞', '∝',
  // Fractions & Superscripts/Subscripts
  '½', '⅓', '⅔', '¼', '¾', '²', '³', 'ⁿ', '₀', '₁', '₂', '₃',
  // Greek Lowercase
  'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'ρ', 'σ', 'τ', 'φ', 'ω',
  // Greek Uppercase & Set Theory
  'Δ', 'Σ', 'Ω', '∈', '∉', '⊂', '⊃', '∪', '∩', '∅',
  // Calculus, Geometry & Misc
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

// Type to track exactly where a symbol should be inserted
type SymbolTarget = { qIndex: number; isOption: boolean; oIndex?: number };

export default function QuizBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id');

  // --- State ---
  const [resourceId, setResourceId] = useState<number | string>('');
  const [passingScore, setPassingScore] = useState<number>(40);
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Track which field's symbol toolbar is currently open
  const [symbolTarget, setSymbolTarget] = useState<SymbolTarget | null>(null);

  // --- Initialization ---
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
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
        setError(err.message || 'Failed to initialize builder.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [quizId]);

  // --- BUG 2 FIX: Escape Key Listener ---
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

  // --- Handlers ---
  const handleAddQuestion = () => setQuestions((prev) => [...prev, emptyQuestion(prev.length)]);
  
  const handleRemoveQuestion = (qIndex: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== qIndex).map((q, i) => ({ ...q, order: i })));
    setSymbolTarget(null); // Close toolbar if open
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
    
    // BUG 2 FIX: Auto-close after inserting
    setSymbolTarget(null);
  };

  // BUG 1 FIX: Safely deep clone the question before modifying the options array
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
      
      // Fallback: If we deleted the correct option, make the first remaining one correct
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
    if (!resourceId) return setError('Please select a topic/resource to attach this quiz to.');
    if (questions.length === 0) return setError('You must add at least one question.');

    const invalidQuestion = questions.find((q) => q.options.length < 2 || !q.options.some((o) => o.is_correct) || !q.text.trim());
    if (invalidQuestion) {
      return setError('Each question needs text, minimum 2 options, and exactly 1 correct option selected.');
    }

    setSaving(true);
    setError('');

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
      setError(err.message || 'Failed to save quiz.');
    } finally {
      setSaving(false);
    }
  };

  // --- Rendering Helpers ---
  const renderSymbolToolbar = (targetMatch: boolean) => {
    if (!targetMatch) return null;
    return (
      <div className="mt-2 p-2 bg-slate-800 rounded-xl flex flex-wrap gap-1 animate-in fade-in zoom-in-95 shadow-lg relative z-10">
        {SYMBOL_LIBRARY.map(sym => (
          <button 
            key={sym} 
            onClick={() => insertSymbol(sym)}
            className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-slate-600 hover:text-white rounded text-sm font-medium transition-colors"
          >
            {sym}
          </button>
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-indigo-400 space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
      <p className="font-medium animate-pulse text-gray-500">Loading Quiz Builder...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/quizzes" className="p-2 hover:bg-slate-100 rounded-full transition-colors shrink-0">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 truncate">
                {quizId ? 'Edit Quiz Assessment' : 'New Quiz Assessment'}
              </h1>
            </div>
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={saving} 
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2 shrink-0 transition-all shadow-sm focus:ring-4 focus:ring-indigo-100 disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Quiz'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-2 animate-in fade-in">
            <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-col-reverse">
          
          {/* --- LEFT SIDEBAR: Settings --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:sticky lg:top-28">
              <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-4">
                <Settings className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-bold text-slate-800">Quiz Settings</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <BookOpen className="w-4 h-4 text-slate-400" /> Link to Subject Topic
                  </label>
                  <select
                    value={resourceId}
                    onChange={(e) => setResourceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="" disabled>Select a resource...</option>
                    {resourceOptions.map((res) => (
                      <option key={res.id} value={res.id}>{res.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Target className="w-4 h-4 text-emerald-500" /> Passing (%)
                    </label>
                    <input 
                      type="number" min="1" max="100" 
                      value={passingScore} 
                      onChange={(e) => setPassingScore(Number(e.target.value))} 
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" 
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Clock className="w-4 h-4 text-amber-500" /> Time (Mins)
                    </label>
                    <input 
                      type="number" min="1" 
                      value={timeLimit} 
                      onChange={(e) => setTimeLimit(Number(e.target.value))} 
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT AREA: Question Builder --- */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Questions <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-sm ml-2">{questions.length}</span>
              </h2>
            </div>

            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                  
                  {/* Question Header & Points */}
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 font-semibold text-slate-700">
                      <span className="bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-sm">
                        {qIndex + 1}
                      </span>
                      Question Details
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1 shadow-sm text-sm">
                        <span className="pl-2 pr-1 text-emerald-600 font-bold">+</span>
                        <input 
                          type="number" step="0.5" 
                          value={q.marks_positive} 
                          onChange={(e) => handleQuestionChange(qIndex, 'marks_positive', Number(e.target.value))} 
                          className="w-12 text-center focus:outline-none" 
                          title="Positive Marks"
                        />
                        <span className="px-2 text-slate-300">|</span>
                        <span className="pr-1 text-rose-500 font-bold">-</span>
                        <input 
                          type="number" step="0.25" 
                          value={q.marks_negative} 
                          onChange={(e) => handleQuestionChange(qIndex, 'marks_negative', Number(e.target.value))} 
                          className="w-12 text-center focus:outline-none" 
                          title="Negative Penalty"
                        />
                      </div>
                      <button onClick={() => handleRemoveQuestion(qIndex)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Question">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Question Text */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-semibold text-slate-700">Question Text</label>
                        <button 
                          onClick={() => setSymbolTarget(
                            symbolTarget?.qIndex === qIndex && !symbolTarget.isOption 
                              ? null 
                              : { qIndex, isOption: false }
                          )}
                          className={`text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${symbolTarget?.qIndex === qIndex && !symbolTarget.isOption ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          <Sigma className="w-3.5 h-3.5" /> Insert Symbol
                        </button>
                      </div>

                      <textarea 
                        value={q.text} 
                        onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} 
                        placeholder="Type the question here..." 
                        rows={3} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y" 
                      />
                      {renderSymbolToolbar(symbolTarget?.qIndex === qIndex && !symbolTarget.isOption)}
                    </div>

                    {/* Options Array */}
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-3 block">Answer Options</label>
                      <div className="space-y-3">
                        {q.options.map((opt, oIndex) => {
                          const isCorrect = opt.is_correct;
                          return (
                            <div key={oIndex} className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${isCorrect ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                              <div className="flex items-start md:items-center gap-3">
                                {/* Custom Radio Button */}
                                <button 
                                  onClick={() => handleSetCorrectOption(qIndex, oIndex)} 
                                  className={`mt-2 md:mt-0 shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isCorrect ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 hover:border-emerald-400'}`}
                                  title="Mark as correct answer"
                                >
                                  {isCorrect && <CheckCircle className="w-4 h-4" />}
                                </button>
                                
                                <textarea 
                                  value={opt.text} 
                                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} 
                                  placeholder={`Option ${oIndex + 1}`} 
                                  rows={1}
                                  className="flex-1 min-w-0 bg-transparent border-0 p-1 focus:ring-0 resize-none font-medium text-slate-700 placeholder:font-normal placeholder:text-slate-400 focus:outline-none" 
                                />
                                
                                {/* Option Actions (Symbol & Trash) */}
                                <div className="flex items-center gap-1 shrink-0 mt-1 md:mt-0">
                                  <button 
                                    onClick={() => setSymbolTarget(
                                      symbolTarget?.qIndex === qIndex && symbolTarget.isOption && symbolTarget.oIndex === oIndex 
                                        ? null 
                                        : { qIndex, isOption: true, oIndex }
                                    )}
                                    className={`p-2 rounded-lg transition-colors ${symbolTarget?.qIndex === qIndex && symbolTarget.isOption && symbolTarget.oIndex === oIndex ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                    title="Insert Symbol"
                                  >
                                    <Sigma className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleRemoveOption(qIndex, oIndex)} 
                                    disabled={q.options.length <= 2}
                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                                    title="Delete Option"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Option Symbol Toolbar rendered below the specific option */}
                              {renderSymbolToolbar(symbolTarget?.qIndex === qIndex && symbolTarget.isOption && symbolTarget.oIndex === oIndex)}
                            </div>
                          );
                        })}
                      </div>

                      <button 
                        onClick={() => handleAddOption(qIndex)} 
                        className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-3 py-2 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add another option
                      </button>
                    </div>

                  </div>
                </div>
              ))}

              {/* Add New Question Button */}
              <button 
                onClick={handleAddQuestion} 
                className="w-full py-6 border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 group-hover:border-indigo-200 rounded-full flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-bold">Add New Question</span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}