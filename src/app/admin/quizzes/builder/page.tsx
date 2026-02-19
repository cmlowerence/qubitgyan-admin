'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, CheckCircle, Save } from 'lucide-react';
import Link from 'next/link';

import { createQuiz, updateQuiz, getQuiz, QuizQuestion, QuizPayload } from '@/services/quizzes';
import { getAllResources } from '@/services/resource';
import { Resource } from '@/types/resource';

const emptyQuestion = (order: number): QuizQuestion => ({
  text: '',
  marks_positive: 1,
  marks_negative: 0,
  order,
  options: [
    { text: '', is_correct: false },
    { text: '', is_correct: false },
  ],
});

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
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const resources = await getAllResources({ type: 'QUIZ' });
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

  const resourceOptions = useMemo(
    () =>
      availableResources.map((res) => ({
        id: res.id,
        label: `${res.node_name || 'Unknown topic'} • ${res.title}`,
      })),
    [availableResources]
  );

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion(prev.length)]);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== qIndex).map((q, i) => ({ ...q, order: i })));
  };

  const handleQuestionChange = (qIndex: number, field: keyof QuizQuestion, value: any) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = { ...updated[qIndex], [field]: value };
      return updated;
    });
  };

  const handleAddOption = (qIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = {
        ...updated[qIndex],
        options: [...updated[qIndex].options, { text: '', is_correct: false }],
      };
      return updated;
    });
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = {
        ...updated[qIndex],
        options: updated[qIndex].options.filter((_, i) => i !== oIndex),
      };
      return updated;
    });
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const options = [...updated[qIndex].options];
      options[oIndex] = { ...options[oIndex], text };
      updated[qIndex] = { ...updated[qIndex], options };
      return updated;
    });
  };

  const handleSetCorrectOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const options = updated[qIndex].options.map((opt, idx) => ({ ...opt, is_correct: idx === oIndex }));
      updated[qIndex] = { ...updated[qIndex], options };
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!resourceId) return setError('Please select a topic/resource to attach this quiz.');
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

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Quiz Builder...</div>;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5 pb-24">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/admin/quizzes" className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate">{quizId ? 'Edit Quiz' : 'Quiz Builder'}</h1>
            <p className="text-gray-500 text-sm">Attach quiz to a topic resource and configure scoring.</p>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={saving} className="px-3 py-2 md:px-4 bg-blue-600 text-white rounded-lg flex items-center gap-2 shrink-0">
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Quiz'}</span>
        </button>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">General Settings</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attach to Topic Resource</label>
          <select
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="" disabled>
              Select topic • quiz resource
            </option>
            {resourceOptions.map((res) => (
              <option key={res.id} value={res.id}>
                {res.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
            <input type="number" min="1" max="100" value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (Minutes)</label>
            <input type="number" min="1" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Questions ({questions.length})</h2>
          <button onClick={handleAddQuestion} className="text-sm text-blue-600 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Question</span>
          </button>
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
            <div className="flex items-start gap-3">
              <span className="bg-gray-100 text-gray-500 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">{qIndex + 1}</span>
              <div className="flex-1 space-y-3 min-w-0">
                <textarea value={q.text} onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} placeholder="Enter your question..." rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="number" step="0.5" value={q.marks_positive} onChange={(e) => handleQuestionChange(qIndex, 'marks_positive', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Positive marks" />
                  <input type="number" step="0.25" value={q.marks_negative} onChange={(e) => handleQuestionChange(qIndex, 'marks_negative', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Negative marks" />
                </div>
              </div>
              <button onClick={() => handleRemoveQuestion(qIndex)} className="text-gray-400 hover:text-red-500 shrink-0">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <button onClick={() => handleSetCorrectOption(qIndex, oIndex)} className={`shrink-0 ${opt.is_correct ? 'text-green-500' : 'text-gray-300'}`}>
                    <CheckCircle className="w-6 h-6" />
                  </button>
                  <input value={opt.text} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} placeholder={`Option ${oIndex + 1}`} className={`flex-1 min-w-0 px-3 py-2 border rounded-lg ${opt.is_correct ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}`} />
                  <button onClick={() => handleRemoveOption(qIndex, oIndex)} className="text-gray-400 hover:text-red-500 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => handleAddOption(qIndex)} className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Option
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
