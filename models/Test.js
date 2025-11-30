const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testType: {
    type: String,
    enum: ['practice', 'official'],
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 18
  },
  passed: {
    type: Boolean,
    required: true
  },
  questions: [{
    questionId: String,
    question: String,
    selectedAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean
  }],
  timeSpent: {
    type: Number, // in seconds
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const TestResult = mongoose.model('TestResult', testResultSchema);

const questionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
    unique: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Question = mongoose.model('Question', questionSchema);

// Track individual question performance for adaptive learning
const userQuestionPerformanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  questionId: {
    type: String,
    required: true,
    index: true
  },
  timesAnswered: {
    type: Number,
    default: 0
  },
  timesCorrect: {
    type: Number,
    default: 0
  },
  timesIncorrect: {
    type: Number,
    default: 0
  },
  lastAnswered: {
    type: Date
  },
  lastCorrect: {
    type: Date
  },
  lastIncorrect: {
    type: Date
  },
  // Weight for adaptive learning - higher weight = more likely to appear
  // Questions with lower correct rates get higher weights
  weight: {
    type: Number,
    default: 1.0
  }
}, {
  timestamps: true
});

// Compound index for efficient lookups
userQuestionPerformanceSchema.index({ userId: 1, questionId: 1 }, { unique: true });

const UserQuestionPerformance = mongoose.model('UserQuestionPerformance', userQuestionPerformanceSchema);

module.exports = { TestResult, Question, UserQuestionPerformance };
