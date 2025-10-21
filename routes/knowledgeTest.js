const express = require('express');
const { Question, TestResult } = require('../models/Test');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get random questions for practice test
router.get('/questions', authenticateToken, async (req, res) => {
  try {
    const { count = 18, category } = req.query;
    
    let query = { isActive: true };
    if (category) {
      query.category = category;
    }

    const questions = await Question.find(query)
      .limit(parseInt(count))
      .sort({ _id: 1 }); // Simple randomization

    // Shuffle questions
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

    // Remove correct answers from response
    const questionsForTest = shuffledQuestions.map(q => ({
      questionId: q.questionId,
      question: q.question,
      options: q.options,
      category: q.category,
      difficulty: q.difficulty
    }));

    res.json({ questions: questionsForTest });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server error fetching questions' });
  }
});

// Submit test results
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { questions, timeSpent, testType = 'practice' } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Questions array is required' });
    }

    // Get correct answers for scoring
    const questionIds = questions.map(q => q.questionId);
    const correctAnswers = await Question.find({ 
      questionId: { $in: questionIds } 
    }).select('questionId correctAnswer question options');

    // Create answer lookup
    const answerLookup = {};
    correctAnswers.forEach(q => {
      answerLookup[q.questionId] = {
        correctAnswer: q.correctAnswer,
        question: q.question,
        options: q.options
      };
    });

    // Score the test
    let score = 0;
    const scoredQuestions = questions.map(q => {
      const correct = answerLookup[q.questionId];
      const isCorrect = q.selectedAnswer === correct.correctAnswer;
      if (isCorrect) score++;

      return {
        questionId: q.questionId,
        question: correct.question,
        selectedAnswer: q.selectedAnswer,
        correctAnswer: correct.correctAnswer,
        isCorrect
      };
    });

    const passed = score >= 15; // Need 15 out of 18 to pass

    // Save test result
    const testResult = new TestResult({
      userId: req.user.userId,
      testType,
      score,
      passed,
      questions: scoredQuestions,
      timeSpent: timeSpent || 0
    });

    await testResult.save();

    // Update user's license status if they passed
    if (passed && testType === 'practice') {
      await User.findByIdAndUpdate(req.user.userId, {
        licenseStatus: 'knowledge-test'
      });
    }

    res.json({
      message: 'Test submitted successfully',
      result: {
        score,
        passed,
        totalQuestions: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        timeSpent
      },
      questions: scoredQuestions
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ message: 'Server error submitting test' });
  }
});

// Get user's test history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, testType } = req.query;
    
    let query = { userId: req.user.userId };
    if (testType) {
      query.testType = testType;
    }

    const testResults = await TestResult.find(query)
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .select('-questions'); // Exclude detailed questions for performance

    res.json({ testResults });
  } catch (error) {
    console.error('Error fetching test history:', error);
    res.status(500).json({ message: 'Server error fetching test history' });
  }
});

// Get detailed test result
router.get('/result/:resultId', authenticateToken, async (req, res) => {
  try {
    const testResult = await TestResult.findOne({
      _id: req.params.resultId,
      userId: req.user.userId
    });

    if (!testResult) {
      return res.status(404).json({ message: 'Test result not found' });
    }

    res.json({ testResult });
  } catch (error) {
    console.error('Error fetching test result:', error);
    res.status(500).json({ message: 'Server error fetching test result' });
  }
});

// Get study materials by category
router.get('/study-materials', authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = { isActive: true };
    if (category) {
      query.category = category;
    }

    const materials = await Question.find(query)
      .select('questionId question options correctAnswer explanation category difficulty')
      .sort({ category: 1, difficulty: 1 });

    // Group by category
    const groupedMaterials = materials.reduce((acc, material) => {
      if (!acc[material.category]) {
        acc[material.category] = [];
      }
      acc[material.category].push(material);
      return acc;
    }, {});

    res.json({ studyMaterials: groupedMaterials });
  } catch (error) {
    console.error('Error fetching study materials:', error);
    res.status(500).json({ message: 'Server error fetching study materials' });
  }
});

// Get test statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all test results for the user
    const testResults = await TestResult.find({ userId });

    if (testResults.length === 0) {
      return res.json({
        totalTests: 0,
        averageScore: 0,
        bestScore: 0,
        passRate: 0,
        totalTimeSpent: 0
      });
    }

    const totalTests = testResults.length;
    const totalScore = testResults.reduce((sum, result) => sum + result.score, 0);
    const averageScore = Math.round(totalScore / totalTests);
    const bestScore = Math.max(...testResults.map(r => r.score));
    const passedTests = testResults.filter(r => r.passed).length;
    const passRate = Math.round((passedTests / totalTests) * 100);
    const totalTimeSpent = testResults.reduce((sum, result) => sum + result.timeSpent, 0);

    res.json({
      totalTests,
      averageScore,
      bestScore,
      passRate,
      totalTimeSpent,
      recentTests: testResults.slice(0, 5).map(r => ({
        id: r._id,
        score: r.score,
        passed: r.passed,
        completedAt: r.completedAt,
        testType: r.testType
      }))
    });
  } catch (error) {
    console.error('Error fetching test stats:', error);
    res.status(500).json({ message: 'Server error fetching test stats' });
  }
});

module.exports = router;
