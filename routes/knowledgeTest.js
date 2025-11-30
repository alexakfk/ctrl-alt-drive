const express = require('express');
const { Question, TestResult, UserQuestionPerformance } = require('../models/Test');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get random questions for practice test with adaptive learning
router.get('/questions', authenticateToken, async (req, res) => {
  try {
    const { count = 18, category } = req.query;
    const userId = req.user.userId;
    const questionCount = parseInt(count);
    
    let query = { isActive: true };
    if (category) {
      query.category = category;
    }

    // Get all eligible questions
    const allQuestions = await Question.find(query);

    if (allQuestions.length === 0) {
      return res.status(404).json({ message: 'No questions found' });
    }

    // Get user's performance data for adaptive learning
    const userPerformance = await UserQuestionPerformance.find({ userId });
    const performanceMap = {};
    userPerformance.forEach(perf => {
      performanceMap[perf.questionId] = perf;
    });

    // Calculate weights for each question based on performance
    // Questions with lower correct rates get higher weights (appear more frequently)
    const questionsWithWeights = allQuestions.map(q => {
      const perf = performanceMap[q.questionId];
      let weight = 1.0; // Default weight

      if (perf && perf.timesAnswered > 0) {
        const correctRate = perf.timesCorrect / perf.timesAnswered;
        // Inverse relationship: lower correct rate = higher weight
        // Weight ranges from 0.1 (always correct) to 5.0 (never correct)
        weight = Math.max(0.1, Math.min(5.0, 2.0 - (correctRate * 1.9)));
        
        // Bonus weight for recently incorrect questions
        if (perf.lastIncorrect) {
          const daysSinceIncorrect = (Date.now() - perf.lastIncorrect) / (1000 * 60 * 60 * 24);
          if (daysSinceIncorrect < 7) {
            weight *= 1.5; // 50% bonus for questions missed in last 7 days
          }
        }
      }

      return { question: q, weight };
    });

    // Weighted random selection
    const selectedQuestions = [];
    const selectedIds = new Set();
    let availableQuestions = [...questionsWithWeights];
    
    // Select questions using weighted random
    let attempts = 0;
    const maxAttempts = questionCount * 10; // Prevent infinite loops
    
    while (selectedQuestions.length < Math.min(questionCount, allQuestions.length) && availableQuestions.length > 0 && attempts < maxAttempts) {
      attempts++;
      
      // Recalculate total weight for remaining questions
      let totalWeight = availableQuestions.reduce((sum, item) => sum + item.weight, 0);
      if (totalWeight === 0) totalWeight = 1; // Prevent division by zero
      
      let random = Math.random() * totalWeight;
      
      for (let i = 0; i < availableQuestions.length; i++) {
        const item = availableQuestions[i];
        random -= item.weight;
        if (random <= 0 && !selectedIds.has(item.question.questionId)) {
          selectedQuestions.push(item.question);
          selectedIds.add(item.question.questionId);
          // Remove from available to prevent duplicates
          availableQuestions = availableQuestions.filter(aq => aq.question.questionId !== item.question.questionId);
          break;
        }
      }
    }

    // If we still need more questions, fill randomly from remaining
    if (selectedQuestions.length < questionCount) {
      const remaining = allQuestions
        .filter(q => !selectedIds.has(q.questionId))
        .sort(() => Math.random() - 0.5)
        .slice(0, questionCount - selectedQuestions.length);
      selectedQuestions.push(...remaining);
    }

    // Shuffle final selection for randomness
    const shuffledQuestions = selectedQuestions.sort(() => Math.random() - 0.5);

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

    // Validate all questions exist
    if (correctAnswers.length !== questionIds.length) {
      const foundIds = new Set(correctAnswers.map(q => q.questionId));
      const missingIds = questionIds.filter(id => !foundIds.has(id));
      return res.status(400).json({ 
        message: 'Some questions were not found in database',
        missingQuestionIds: missingIds
      });
    }

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
      if (!correct) {
        console.error(`Question ${q.questionId} not found in answerLookup`);
        return null;
      }
      
      const isCorrect = q.selectedAnswer && 
                        q.selectedAnswer === correct.correctAnswer;
      if (isCorrect) score++;

      return {
        questionId: q.questionId,
        question: correct.question,
        selectedAnswer: q.selectedAnswer || '',
        correctAnswer: correct.correctAnswer,
        isCorrect
      };
    }).filter(q => q !== null); // Remove any null entries

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

    // Update individual question performance for adaptive learning
    const userId = req.user.userId;
    const now = new Date();
    
    for (const q of scoredQuestions) {
      const updateData = {
        userId,
        questionId: q.questionId,
        $inc: {
          timesAnswered: 1,
          ...(q.isCorrect ? { timesCorrect: 1 } : { timesIncorrect: 1 })
        },
        lastAnswered: now,
        ...(q.isCorrect ? { lastCorrect: now } : { lastIncorrect: now })
      };

      // Calculate and update weight based on performance
      const existingPerf = await UserQuestionPerformance.findOne({
        userId,
        questionId: q.questionId
      });

      let newTimesAnswered = (existingPerf?.timesAnswered || 0) + 1;
      let newTimesCorrect = q.isCorrect 
        ? (existingPerf?.timesCorrect || 0) + 1 
        : (existingPerf?.timesCorrect || 0);
      
      const correctRate = newTimesAnswered > 0 ? newTimesCorrect / newTimesAnswered : 0.5;
      // Weight ranges from 0.1 (always correct) to 5.0 (never correct)
      const weight = Math.max(0.1, Math.min(5.0, 2.0 - (correctRate * 1.9)));

      updateData.weight = weight;

      await UserQuestionPerformance.findOneAndUpdate(
        { userId, questionId: q.questionId },
        updateData,
        { upsert: true, new: true }
      );
    }

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
