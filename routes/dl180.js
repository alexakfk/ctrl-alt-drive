const express = require('express');
const mongoose = require('mongoose');

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

// Schema for DL-180 form data
const dl180Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    firstName: String,
    lastName: String,
    middleName: String,
    dateOfBirth: Date,
    socialSecurityNumber: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    phone: String,
    email: String
  },
  militaryInfo: {
    militaryId: String,
    rank: String,
    base: String,
    branch: String
  },
  medicalInfo: {
    physicianName: String,
    physicianLicense: String,
    physicianPhone: String,
    physicianAddress: String,
    examinationDate: Date,
    visionTest: {
      rightEye: String,
      leftEye: String,
      bothEyes: String
    },
    medicalConditions: [String],
    medications: [String],
    restrictions: String,
    physicianSignature: String,
    physicianDate: Date
  },
  formStatus: {
    type: String,
    enum: ['draft', 'completed', 'submitted'],
    default: 'draft'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const DL180Form = mongoose.model('DL180Form', dl180Schema);

// Get DL-180 form for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    let form = await DL180Form.findOne({ userId: req.user.userId });

    if (!form) {
      // Get user info to pre-populate form
      const User = require('../models/User');
      const user = await User.findById(req.user.userId).select('firstName lastName email phone rank base militaryId');

      form = new DL180Form({
        userId: req.user.userId,
        personalInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        },
        militaryInfo: {
          militaryId: user.militaryId,
          rank: user.rank,
          base: user.base
        }
      });

      await form.save();
    }

    // Remove sensitive data before sending
    const formData = form.toObject();
    delete formData.personalInfo.socialSecurityNumber;

    res.json({ form: formData });
  } catch (error) {
    console.error('Error fetching DL-180 form:', error);
    res.status(500).json({ message: 'Server error fetching DL-180 form' });
  }
});

// Update DL-180 form
router.put('/', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;

    // Validate required fields
    const requiredFields = ['personalInfo', 'militaryInfo'];
    for (const field of requiredFields) {
      if (!updates[field]) {
        return res.status(400).json({ 
          message: `${field} is required` 
        });
      }
    }

    const form = await DL180Form.findOneAndUpdate(
      { userId: req.user.userId },
      { 
        ...updates, 
        lastUpdated: new Date() 
      },
      { new: true, upsert: true }
    );

    res.json({ 
      message: 'DL-180 form updated successfully',
      form: form.toObject()
    });
  } catch (error) {
    console.error('Error updating DL-180 form:', error);
    res.status(500).json({ message: 'Server error updating DL-180 form' });
  }
});

// Submit DL-180 form
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const form = await DL180Form.findOne({ userId: req.user.userId });

    if (!form) {
      return res.status(404).json({ message: 'DL-180 form not found' });
    }

    // Validate that all required fields are completed
    const requiredFields = [
      'personalInfo.firstName',
      'personalInfo.lastName',
      'personalInfo.dateOfBirth',
      'personalInfo.address.street',
      'personalInfo.address.city',
      'personalInfo.address.state',
      'personalInfo.address.zipCode',
      'medicalInfo.physicianName',
      'medicalInfo.physicianLicense',
      'medicalInfo.examinationDate',
      'medicalInfo.physicianSignature',
      'medicalInfo.physicianDate'
    ];

    const missingFields = [];
    requiredFields.forEach(field => {
      const value = field.split('.').reduce((obj, key) => obj && obj[key], form);
      if (!value) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Please complete all required fields before submitting',
        missingFields
      });
    }

    // Update form status
    form.formStatus = 'submitted';
    form.lastUpdated = new Date();
    await form.save();

    res.json({ 
      message: 'DL-180 form submitted successfully',
      submissionId: `DL180-${Date.now()}`,
      nextSteps: [
        'Take the knowledge test at any PA DMV location',
        'Schedule your road test after passing the knowledge test',
        'Bring your completed DL-180 form to both tests'
      ]
    });
  } catch (error) {
    console.error('Error submitting DL-180 form:', error);
    res.status(500).json({ message: 'Server error submitting DL-180 form' });
  }
});

// Get form completion status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const form = await DL180Form.findOne({ userId: req.user.userId });

    if (!form) {
      return res.json({
        exists: false,
        completionPercentage: 0,
        status: 'not-started',
        missingSections: ['personalInfo', 'militaryInfo', 'medicalInfo']
      });
    }

    // Calculate completion percentage
    const sections = ['personalInfo', 'militaryInfo', 'medicalInfo'];
    let completedSections = 0;

    sections.forEach(section => {
      const sectionData = form[section];
      if (sectionData && Object.keys(sectionData).length > 0) {
        completedSections++;
      }
    });

    const completionPercentage = Math.round((completedSections / sections.length) * 100);

    // Identify missing sections
    const missingSections = sections.filter(section => {
      const sectionData = form[section];
      return !sectionData || Object.keys(sectionData).length === 0;
    });

    res.json({
      exists: true,
      completionPercentage,
      status: form.formStatus,
      missingSections,
      lastUpdated: form.lastUpdated
    });
  } catch (error) {
    console.error('Error fetching form status:', error);
    res.status(500).json({ message: 'Server error fetching form status' });
  }
});

// Get form guidance/instructions
router.get('/guidance', authenticateToken, async (req, res) => {
  try {
    const guidance = {
      overview: {
        title: 'DL-180 Form Completion Guide',
        description: 'The DL-180 form is required for obtaining a Pennsylvania driver\'s license. This form must be completed by both you and a licensed physician.'
      },
      sections: [
        {
          id: 'personalInfo',
          title: 'Personal Information',
          description: 'Complete your personal details',
          instructions: [
            'Fill in your full legal name',
            'Provide your date of birth',
            'Enter your Social Security Number',
            'Include your current address',
            'Add your contact information'
          ],
          required: true,
          completedBy: 'Soldier'
        },
        {
          id: 'militaryInfo',
          title: 'Military Information',
          description: 'Your military service details',
          instructions: [
            'Enter your Military ID number',
            'Specify your rank',
            'Include your base assignment',
            'Select your branch of service'
          ],
          required: true,
          completedBy: 'Soldier'
        },
        {
          id: 'medicalInfo',
          title: 'Medical Examination',
          description: 'Physical examination and vision test',
          instructions: [
            'Schedule appointment with licensed physician',
            'Complete vision test (20/40 or better required)',
            'Disclose any medical conditions or medications',
            'Physician must sign and date the form',
            'Physician must include license number'
          ],
          required: true,
          completedBy: 'Licensed Physician'
        }
      ],
      tips: [
        'Schedule your medical examination well in advance',
        'Bring valid ID to your medical appointment',
        'Ensure your physician is licensed in Pennsylvania',
        'Keep a copy of the completed form for your records',
        'The form is valid for 90 days from the examination date'
      ],
      commonMistakes: [
        'Incomplete physician information',
        'Missing physician signature or date',
        'Incorrect vision test results',
        'Outdated examination date',
        'Missing required personal information'
      ]
    };

    res.json({ guidance });
  } catch (error) {
    console.error('Error fetching form guidance:', error);
    res.status(500).json({ message: 'Server error fetching form guidance' });
  }
});

module.exports = router;
