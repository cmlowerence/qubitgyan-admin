'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, CheckCircle, HelpCircle, Save } from 'lucide-react';
import Link from 'next/link';

// Import our services
import { createQuiz, updateQuiz, getQuiz, QuizQuestion, QuizPayload } from '@/services/quizzes';
import { getAllResources } from '@/services/resource';
import { Resource } from '@/types/resource';

export default function QuizBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id'); // If present, we are editing

  // --- 1. Base Quiz State ---
  const [resourceId, setResourceId] = useState<number | string>('');
  const [passingScore, setPassingScore] = useState<number>(40);
  const [timeLimit, setTimeLimit] = useState<number>(30);
  
  // --- 2. Nested Questions State ---
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  
  // --- 3. UI State ---
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Initial Load: Fetch resources and (if editing) the existing quiz
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        // Fetch only resources of type 'QUIZ' so we can attach this quiz payload to them
        const resources = await getAllResources({ type: 'QUIZ' });
        setAvailableResources(resources);

        if (quizId) {
          const existingQuiz = await getQuiz(Number(quizId));
          setResourceId(existingQuiz.resource);
          setPassingScore(existingQuiz.passing_score_percentage);
          setTimeLimit(existingQuiz.time_limit_minutes);
          setQuestions(existingQuiz.questions);
        } else {
          // Start with one empty question by default
          handleAddQuestion();
        }
      } catch (err: any) {
        setError(err.message || "Failed to initialize builder.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [quizId]);

  // --- Dynamic Form Handlers: Questions ---
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', marks_positive: 1, marks_negative: 0, order: questions.length, options: [] }
    ]);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated.map((q, i) => ({ ...q, order: i }))); // Re-adjust ordering
  };

  const handleQuestionChange = (qIndex: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[qIndex] = { ...updated[qIndex], [field]: value };
    setQuestions(updated);
  };

  // --- Dynamic Form Handlers: Options (Deeply Nested) ---
  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: '', is_correct: false });
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = text;
    setQuestions(updated);
  };

  const handleSetCorrectOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    // Optional: If you want strictly ONE correct answer per question, uncomment the next line to reset others:
    // updated[qIndex].options.forEach(opt => opt.is_correct = false);
    
    updated[qIndex].options[oIndex].is_correct = !updated[qIndex].options[oIndex].is_correct;
    setQuestions(updated);
  };

  // --- Submit Payload to Backend ---
  const handleSubmit = async () => {
    if (!resourceId) return setError("Please select a resource to attach this quiz to.");
    if (questions.length === 0) return setError("You must add at least one question.");
    
    // Quick validation check
    const invalidQuestion = questions.find(q => q.options.length < 2 || !q.options.some(o => o.is_correct));
    if (invalidQuestion) {
      return setError("Every question must have at least 2 options and 1 correct answer.");
    }

    setSaving(true);
    setError('');

    const payload: QuizPayload = {
      resource: Number(resourceId),
      passing_score_percentage: passingScore,
      time_limit_minutes: timeLimit,
      questions: questions
    };

    try {
      if (quizId) {
        await updateQuiz(Number(quizId), payload);
      } else {
        await createQuiz(payload);
      }
      router.push('/admin/quizzes'); // Go back to the dashboard on success
    } catch (err: any) {
      setError(err.message || "Failed to save quiz.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Quiz Builder...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/quizzes" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{quizId ? 'Edit Quiz' : 'Quiz Builder'}</h1>
            <p className="text-gray-500 text-sm">Design assessments and configure scoring.</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={saving}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Quiz'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg font-medium shadow-sm">
          {error}
        </div>
      )}

      {/* 1. Quiz Settings Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">General Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Attach to Resource</label>
            <select
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="" disabled>Select a QUIZ resource...</option>
              {availableResources.map(res => (
                <option key={res.id} value={res.id}>{res.title} (Node: {res.node_name})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
            <input
              type="number" min="1" max="100"
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (Minutes)</label>
            <input
              type="number" min="1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Questions Array Builder */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Questions ({questions.length})</h2>
          <button 
            onClick={handleAddQuestion}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            <Plus className="w-4 h-4"/> Add Question
          </button>
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative group">
            
            <button 
              onClick={() => handleRemoveQuestion(qIndex)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="flex gap-4 items-start mb-6">
              <div className="bg-gray-100 text-gray-500 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                {qIndex + 1}
              </div>
              <div className="flex-1 space-y-4">
                <textarea
                  placeholder="Enter your question here..."
                  value={q.text}
                  onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                  rows={2}
                />
                
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500 font-medium">Positive Marks (+)</label>
                    <input 
                      type="number" step="0.5" value={q.marks_positive} 
                      onChange={(e) => handleQuestionChange(qIndex, 'marks_positive', Number(e.target.value))}
                      className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500 font-medium">Negative Marks (-)</label>
                    <input 
                      type="number" step="0.25" value={q.marks_negative} 
                      onChange={(e) => handleQuestionChange(qIndex, 'marks_negative', Number(e.target.value))}
                      className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Deeply Nested Options Builder */}
            <div className="ml-12 pl-6 border-l-2 border-gray-100 space-y-3">
              <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                Options <HelpCircle className="w-3 h-3 text-gray-400" />
              </p>
              
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-3">
                  <button 
                    onClick={() => handleSetCorrectOption(qIndex, oIndex)}
                    className={`shrink-0 transition-colors ${opt.is_correct ? 'text-green-500' : 'text-gray-300 hover:text-green-400'}`}
                    title="Toggle Correct Answer"
                  >
                    <CheckCircle className="w-6 h-6" />
                  </button>
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt.text}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${opt.is_correct ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}`}
                  />
                  <button 
                    onClick={() => handleRemoveOption(qIndex, oIndex)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => handleAddOption(qIndex)}
                className="text-sm text-gray-500 hover:text-blue-600 font-medium flex items-center gap-1 mt-2"
              >
                <Plus className="w-3 h-3" /> Add Option
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}