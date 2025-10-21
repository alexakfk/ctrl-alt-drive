const express = require('express');
const mongoose = require('mongoose');
const { Question } = require('./models/Test');

const router = express.Router();

// Sample PA knowledge test questions
const sampleQuestions = [
  {
    questionId: 'pa001',
    question: 'What is the speed limit in a school zone when children are present?',
    options: ['15 mph', '20 mph', '25 mph', '30 mph'],
    correctAnswer: '20 mph',
    explanation: 'The speed limit in a school zone when children are present is 20 mph.',
    category: 'speed-limits',
    difficulty: 'easy'
  },
  {
    questionId: 'pa002',
    question: 'When approaching a school bus with flashing red lights, you must:',
    options: [
      'Slow down and proceed with caution',
      'Stop at least 10 feet away',
      'Stop at least 20 feet away',
      'Stop only if children are visible'
    ],
    correctAnswer: 'Stop at least 10 feet away',
    explanation: 'You must stop at least 10 feet away from a school bus with flashing red lights.',
    category: 'school-bus',
    difficulty: 'medium'
  },
  {
    questionId: 'pa003',
    question: 'What does a yellow traffic light mean?',
    options: [
      'Stop if you can do so safely',
      'Slow down and proceed with caution',
      'Speed up to beat the red light',
      'Come to a complete stop'
    ],
    correctAnswer: 'Stop if you can do so safely',
    explanation: 'A yellow light means stop if you can do so safely, otherwise proceed with caution.',
    category: 'traffic-signals',
    difficulty: 'easy'
  },
  {
    questionId: 'pa004',
    question: 'When parallel parking, you should park within how many inches of the curb?',
    options: ['6 inches', '12 inches', '18 inches', '24 inches'],
    correctAnswer: '12 inches',
    explanation: 'When parallel parking, you should park within 12 inches of the curb.',
    category: 'parking',
    difficulty: 'medium'
  },
  {
    questionId: 'pa005',
    question: 'What is the minimum following distance in good weather conditions?',
    options: ['1 second', '2 seconds', '3 seconds', '4 seconds'],
    correctAnswer: '3 seconds',
    explanation: 'The minimum following distance in good weather conditions is 3 seconds.',
    category: 'following-distance',
    difficulty: 'easy'
  },
  {
    questionId: 'pa006',
    question: 'When turning left at an intersection, you should:',
    options: [
      'Turn into the nearest lane',
      'Turn into the leftmost lane',
      'Turn into any available lane',
      'Turn into the rightmost lane'
    ],
    correctAnswer: 'Turn into the nearest lane',
    explanation: 'When turning left at an intersection, you should turn into the nearest lane.',
    category: 'turning',
    difficulty: 'medium'
  },
  {
    questionId: 'pa007',
    question: 'What does a solid white line on the road mean?',
    options: [
      'You may cross it to change lanes',
      'You may not cross it',
      'It indicates a bike lane',
      'It indicates a bus lane'
    ],
    correctAnswer: 'You may not cross it',
    explanation: 'A solid white line means you may not cross it.',
    category: 'lane-markings',
    difficulty: 'easy'
  },
  {
    questionId: 'pa008',
    question: 'When driving in fog, you should:',
    options: [
      'Use high beam headlights',
      'Use low beam headlights',
      'Turn off all lights',
      'Use hazard lights'
    ],
    correctAnswer: 'Use low beam headlights',
    explanation: 'When driving in fog, you should use low beam headlights.',
    category: 'weather',
    difficulty: 'medium'
  },
  {
    questionId: 'pa009',
    question: 'What is the legal blood alcohol limit for drivers 21 and over?',
    options: ['0.05%', '0.08%', '0.10%', '0.12%'],
    correctAnswer: '0.08%',
    explanation: 'The legal blood alcohol limit for drivers 21 and over is 0.08%.',
    category: 'alcohol',
    difficulty: 'easy'
  },
  {
    questionId: 'pa010',
    question: 'When approaching a railroad crossing with flashing lights, you must:',
    options: [
      'Slow down and proceed with caution',
      'Stop and wait for the train to pass',
      'Stop only if a train is visible',
      'Speed up to cross quickly'
    ],
    correctAnswer: 'Stop and wait for the train to pass',
    explanation: 'When approaching a railroad crossing with flashing lights, you must stop and wait for the train to pass.',
    category: 'railroad',
    difficulty: 'medium'
  },
  {
    questionId: 'pa011',
    question: 'What does a red octagonal sign mean?',
    options: ['Yield', 'Stop', 'No Entry', 'Slow Down'],
    correctAnswer: 'Stop',
    explanation: 'A red octagonal sign means stop.',
    category: 'signs',
    difficulty: 'easy'
  },
  {
    questionId: 'pa012',
    question: 'When changing lanes, you should:',
    options: [
      'Signal and check mirrors only',
      'Signal, check mirrors, and look over your shoulder',
      'Check mirrors only',
      'Signal only'
    ],
    correctAnswer: 'Signal, check mirrors, and look over your shoulder',
    explanation: 'When changing lanes, you should signal, check mirrors, and look over your shoulder.',
    category: 'lane-changes',
    difficulty: 'medium'
  },
  {
    questionId: 'pa013',
    question: 'What is the speed limit in a residential area unless otherwise posted?',
    options: ['20 mph', '25 mph', '30 mph', '35 mph'],
    correctAnswer: '25 mph',
    explanation: 'The speed limit in a residential area unless otherwise posted is 25 mph.',
    category: 'speed-limits',
    difficulty: 'easy'
  },
  {
    questionId: 'pa014',
    question: 'When driving on a highway, you should use the left lane for:',
    options: [
      'Passing only',
      'Cruising at high speeds',
      'Emergency vehicles only',
      'Any purpose'
    ],
    correctAnswer: 'Passing only',
    explanation: 'When driving on a highway, you should use the left lane for passing only.',
    category: 'highway',
    difficulty: 'medium'
  },
  {
    questionId: 'pa015',
    question: 'What does a yellow diamond-shaped sign mean?',
    options: ['Warning', 'Stop', 'Yield', 'No Entry'],
    correctAnswer: 'Warning',
    explanation: 'A yellow diamond-shaped sign means warning.',
    category: 'signs',
    difficulty: 'easy'
  },
  {
    questionId: 'pa016',
    question: 'When backing up, you should:',
    options: [
      'Use only your mirrors',
      'Look over your shoulder',
      'Use only your rearview mirror',
      'Not look behind you'
    ],
    correctAnswer: 'Look over your shoulder',
    explanation: 'When backing up, you should look over your shoulder.',
    category: 'backing',
    difficulty: 'medium'
  },
  {
    questionId: 'pa017',
    question: 'What is the minimum age to obtain a learner\'s permit in Pennsylvania?',
    options: ['15 years', '16 years', '17 years', '18 years'],
    correctAnswer: '16 years',
    explanation: 'The minimum age to obtain a learner\'s permit in Pennsylvania is 16 years.',
    category: 'licensing',
    difficulty: 'easy'
  },
  {
    questionId: 'pa018',
    question: 'When approaching a yield sign, you should:',
    options: [
      'Come to a complete stop',
      'Slow down and yield to oncoming traffic',
      'Speed up to merge',
      'Ignore the sign'
    ],
    correctAnswer: 'Slow down and yield to oncoming traffic',
    explanation: 'When approaching a yield sign, you should slow down and yield to oncoming traffic.',
    category: 'yield',
    difficulty: 'medium'
  }
];

// Initialize sample questions in database
const initializeQuestions = async () => {
  try {
    const count = await Question.countDocuments();
    if (count === 0) {
      await Question.insertMany(sampleQuestions);
      console.log('Sample questions initialized');
    }
  } catch (error) {
    console.error('Error initializing questions:', error);
  }
};

// Initialize questions when the module is loaded
initializeQuestions();

module.exports = router;
