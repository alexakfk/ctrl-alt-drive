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

module.exports = { TestResult, Question };
