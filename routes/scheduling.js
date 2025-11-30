const express = require('express');
const mongoose = require('mongoose');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Schema for driving schools
const drivingSchoolSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  email: String,
  services: [String],
  militaryDiscount: Boolean,
  militaryDiscountPercentage: Number,
  dmvScheduling: Boolean,
  isActive: { type: Boolean, default: true }
});

const DrivingSchool = mongoose.model('DrivingSchool', drivingSchoolSchema);

// Schema for DMV locations
const dmvLocationSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  services: [String],
  militarySlots: Boolean,
  militarySlotsPerWeek: Number,
  isActive: { type: Boolean, default: true }
});

const DMVLocation = mongoose.model('DMVLocation', dmvLocationSchema);

// Get available DMV locations
router.get('/dmv-locations', authenticateToken, async (req, res) => {
  try {
    const locations = await DMVLocation.find({ isActive: true });
    res.json({ locations });
  } catch (error) {
    console.error('Error fetching DMV locations:', error);
    res.status(500).json({ message: 'Server error fetching DMV locations' });
  }
});

// Get partner driving schools
router.get('/driving-schools', authenticateToken, async (req, res) => {
  try {
    const schools = await DrivingSchool.find({ isActive: true });
    res.json({ schools });
  } catch (error) {
    console.error('Error fetching driving schools:', error);
    res.status(500).json({ message: 'Server error fetching driving schools' });
  }
});

// Request DMV appointment
router.post('/dmv-appointment', authenticateToken, async (req, res) => {
  try {
    const { locationId, preferredDate, serviceType, notes } = req.body;

    if (!locationId || !preferredDate || !serviceType) {
      return res.status(400).json({ 
        message: 'Location ID, preferred date, and service type are required' 
      });
    }

    // Check if location exists and has military slots
    const location = await DMVLocation.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: 'DMV location not found' });
    }

    // Create appointment request (this would typically integrate with DMV system)
    const appointmentRequest = {
      userId: req.user.userId,
      locationId,
      preferredDate: new Date(preferredDate),
      serviceType,
      notes,
      status: 'pending',
      requestedAt: new Date(),
      militaryPriority: true
    };

    // In a real implementation, this would send a request to the DMV system
    // For now, we'll simulate the response
    res.status(201).json({
      message: 'DMV appointment request submitted successfully',
      appointmentRequest: {
        ...appointmentRequest,
        estimatedConfirmationTime: '2-3 business days',
        confirmationNumber: `DMV-${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Error requesting DMV appointment:', error);
    res.status(500).json({ message: 'Server error requesting DMV appointment' });
  }
});

// Contact driving school
router.post('/contact-school', authenticateToken, async (req, res) => {
  try {
    const { schoolId, message, contactMethod } = req.body;

    if (!schoolId || !message) {
      return res.status(400).json({ 
        message: 'School ID and message are required' 
      });
    }

    const school = await DrivingSchool.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: 'Driving school not found' });
    }

    // Get user info for the message
    const User = require('../models/User');
    const user = await User.findById(req.user.userId).select('firstName lastName email phone rank base');

    const contactRequest = {
      userId: req.user.userId,
      schoolId,
      message,
      contactMethod: contactMethod || 'email',
      userInfo: user,
      status: 'pending',
      createdAt: new Date()
    };

    // In a real implementation, this would send an email/notification to the school
    res.status(201).json({
      message: 'Contact request sent to driving school successfully',
      contactRequest: {
        ...contactRequest,
        schoolName: school.name,
        estimatedResponseTime: '1-2 business days'
      }
    });
  } catch (error) {
    console.error('Error contacting driving school:', error);
    res.status(500).json({ message: 'Server error contacting driving school' });
  }
});

// Get AAA services for military
router.get('/aaa-services', authenticateToken, async (req, res) => {
  try {
    // Mock AAA services - in real implementation, this would integrate with AAA API
    const aaaServices = [
      {
        id: 'license-processing',
        name: 'License Processing Assistance',
        description: 'Help with document preparation and submission',
        militaryDiscount: true,
        discountPercentage: 15,
        locations: ['On-base service', 'Local AAA offices']
      },
      {
        id: 'document-help',
        name: 'Document Preparation Help',
        description: 'Assistance with DL-180 form completion',
        militaryDiscount: true,
        discountPercentage: 20,
        locations: ['On-base service']
      },
      {
        id: 'test-scheduling',
        name: 'Test Scheduling Coordination',
        description: 'Help scheduling knowledge and road tests',
        militaryDiscount: false,
        locations: ['Local AAA offices']
      }
    ];

    res.json({ services: aaaServices });
  } catch (error) {
    console.error('Error fetching AAA services:', error);
    res.status(500).json({ message: 'Server error fetching AAA services' });
  }
});

// Request AAA service
router.post('/aaa-service', authenticateToken, async (req, res) => {
  try {
    const { serviceId, preferredDate, location, notes } = req.body;

    if (!serviceId) {
      return res.status(400).json({ message: 'Service ID is required' });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.userId).select('firstName lastName email phone rank base');

    const serviceRequest = {
      userId: req.user.userId,
      serviceId,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      location,
      notes,
      userInfo: user,
      status: 'pending',
      requestedAt: new Date()
    };

    res.status(201).json({
      message: 'AAA service request submitted successfully',
      serviceRequest: {
        ...serviceRequest,
        estimatedResponseTime: '1-3 business days',
        confirmationNumber: `AAA-${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Error requesting AAA service:', error);
    res.status(500).json({ message: 'Server error requesting AAA service' });
  }
});

// Get scheduling statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // This would typically aggregate data from various scheduling systems
    const stats = {
      dmvLocations: await DMVLocation.countDocuments({ isActive: true }),
      drivingSchools: await DrivingSchool.countDocuments({ isActive: true }),
      militarySlotsAvailable: await DMVLocation.countDocuments({ 
        isActive: true, 
        militarySlots: true 
      }),
      averageWaitTime: '3-5 business days',
      successRate: 94
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching scheduling stats:', error);
    res.status(500).json({ message: 'Server error fetching scheduling stats' });
  }
});

module.exports = router;
