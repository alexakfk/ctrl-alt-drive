import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw,
  BarChart3,
  Target,
  BookMarked
} from 'lucide-react';

const KnowledgeTest = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studyMaterials, setStudyMaterials] = useState(null);

  useEffect(() => {
    fetchStudyMaterials();
  }, []);

  useEffect(() => {
    let interval;
    if (testStarted && !testCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStarted, testCompleted]);

  const fetchStudyMaterials = async () => {
    try {
      const response = await axios.get('/api/test/study-materials');
      setStudyMaterials(response.data.studyMaterials);
    } catch (error) {
      console.error('Error fetching study materials:', error);
    }
  };

  const startTest = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/test/questions?count=18');
      setQuestions(response.data.questions);
      setTestStarted(true);
      setTimeSpent(0);
      setCurrentQuestion(0);
      setAnswers({});
      setTestCompleted(false);
      setTestResult(null);
    } catch (error) {
      toast.error('Failed to load test questions');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitTest = async () => {
    try {
      setLoading(true);
      
      const questionsWithAnswers = questions.map(q => ({
        questionId: q.questionId,
        selectedAnswer: answers[q.questionId] || ''
      }));

      const response = await axios.post('/api/test/submit', {
        questions: questionsWithAnswers,
        timeSpent,
        testType: 'practice'
      });

      setTestResult(response.data.result);
      setTestCompleted(true);
      toast.success('Test submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit test');
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setTestResult(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeSpent(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (testCompleted && testResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card text-center">
          <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
            testResult.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {testResult.passed ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {testResult.passed ? 'Congratulations!' : 'Keep Studying!'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {testResult.passed 
              ? 'You passed the practice test! You\'re ready for the official knowledge test.'
              : 'You need to score 15 or higher to pass. Review the questions and try again.'
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{testResult.score}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{testResult.percentage}%</div>
              <div className="text-sm text-gray-600">Score Percentage</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{formatTime(testResult.timeSpent)}</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetTest}
              className="btn-primary flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Take Another Test</span>
            </button>
            <button
              onClick={() => window.location.href = '/checklist'}
              className="btn-outline flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Update Checklist</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (testStarted && questions.length > 0) {
    const question = questions[currentQuestion];
    const selectedAnswer = answers[question.questionId];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Test Header */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">PA Knowledge Test Practice</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              <div>
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="progress-bar mb-4">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {question.question}
            </h2>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.questionId}
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={() => selectAnswer(question.questionId, option)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[questions[index].questionId]
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={submitTest}
                disabled={loading || !selectedAnswer}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Test'}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={!selectedAnswer}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Test Practice</h1>
        </div>
        <p className="text-gray-600">
          Practice for the Pennsylvania driver's license knowledge test. You need to score 15 out of 18 questions correctly to pass.
        </p>
      </div>

      {/* Test Instructions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Instructions</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span>The test consists of 18 multiple-choice questions</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span>You need 15 correct answers to pass (83%)</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span>You can navigate between questions freely</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Take your time and read each question carefully</span>
          </li>
        </ul>
      </div>

      {/* Study Materials */}
      {studyMaterials && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Study Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(studyMaterials).map(([category, materials]) => (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2 capitalize">
                  {category.replace('-', ' ')}
                </h3>
                <p className="text-sm text-gray-600">
                  {materials.length} practice questions available
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Test Button */}
      <div className="card text-center">
        <button
          onClick={startTest}
          disabled={loading}
          className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Loading Test...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Start Practice Test</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default KnowledgeTest;
