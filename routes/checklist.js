const express = require('express');
const { Checklist, Appointment } = require('../models/Checklist');
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

// Get or create user checklist
router.get('/', authenticateToken, async (req, res) => {
  try {
    let checklist = await Checklist.findOne({ userId: req.user.userId });

    if (!checklist) {
      // Create initial checklist
      checklist = new Checklist({
        userId: req.user.userId,
        items: [
          {
            id: 'knowledge-test-prep',
            title: 'Prepare for Knowledge Test',
            description: 'Study PA driver\'s manual and take practice tests',
            category: 'knowledge-test',
            priority: 'high'
          },
          {
            id: 'dl180-form',
            title: 'Complete DL-180 Form',
            description: 'Fill out DL-180 form with physician signature',
            category: 'dl180-form',
            priority: 'high'
          },
          {
            id: 'eye-exam',
            title: 'Schedule Eye Exam',
            description: 'Complete required eye examination',
            category: 'eye-exam',
            priority: 'medium'
          },
          {
            id: 'knowledge-test',
            title: 'Take Knowledge Test',
            description: 'Pass the PA knowledge test (15/18 correct)',
            category: 'knowledge-test',
            priority: 'high'
          },
          {
            id: 'road-test-prep',
            title: 'Prepare for Road Test',
            description: 'Practice driving and schedule road test',
            category: 'road-test',
            priority: 'medium'
          },
          {
            id: 'road-test',
            title: 'Take Road Test',
            description: 'Complete the practical driving test',
            category: 'road-test',
            priority: 'high'
          }
        ]
      });

      await checklist.save();
    }

    res.json({ checklist });
  } catch (error) {
    console.error('Error fetching checklist:', error);
    res.status(500).json({ message: 'Server error fetching checklist' });
  }
});

// Update checklist item
router.put('/item/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { completed, notes } = req.body;

    const checklist = await Checklist.findOne({ userId: req.user.userId });
    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    const item = checklist.items.find(i => i.id === itemId);
    if (!item) {
      return res.status(404).json({ message: 'Checklist item not found' });
    }

    // Update item
    item.completed = completed !== undefined ? completed : item.completed;
    item.notes = notes !== undefined ? notes : item.notes;
    
    if (completed) {
      item.completedAt = new Date();
    }

    // Calculate overall progress
    const completedItems = checklist.items.filter(i => i.completed).length;
    checklist.overallProgress = Math.round((completedItems / checklist.items.length) * 100);
    checklist.lastUpdated = new Date();

    await checklist.save();

    res.json({ 
      message: 'Checklist item updated successfully',
      item,
      overallProgress: checklist.overallProgress
    });
  } catch (error) {
    console.error('Error updating checklist item:', error);
    res.status(500).json({ message: 'Server error updating checklist item' });
  }
});

// Add custom checklist item
router.post('/item', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, priority = 'medium' } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ 
        message: 'Title, description, and category are required' 
      });
    }

    const checklist = await Checklist.findOne({ userId: req.user.userId });
    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    const newItem = {
      id: `custom-${Date.now()}`,
      title,
      description,
      category,
      priority,
      completed: false
    };

    checklist.items.push(newItem);
    checklist.lastUpdated = new Date();

    await checklist.save();

    res.json({ 
      message: 'Custom item added successfully',
      item: newItem
    });
  } catch (error) {
    console.error('Error adding checklist item:', error);
    res.status(500).json({ message: 'Server error adding checklist item' });
  }
});

// Get appointments
router.get('/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.userId })
      .sort({ scheduledDate: 1 });

    res.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
});

// Create appointment
router.post('/appointments', authenticateToken, async (req, res) => {
  try {
    const { type, scheduledDate, location, notes } = req.body;

    if (!type || !scheduledDate || !location) {
      return res.status(400).json({ 
        message: 'Type, scheduled date, and location are required' 
      });
    }

    const appointment = new Appointment({
      userId: req.user.userId,
      type,
      scheduledDate: new Date(scheduledDate),
      location,
      notes
    });

    await appointment.save();

    res.status(201).json({ 
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error creating appointment' });
  }
});

// Update appointment
router.put('/appointments/:appointmentId', authenticateToken, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updates = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, userId: req.user.userId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ 
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error updating appointment' });
  }
});

// Delete appointment
router.delete('/appointments/:appointmentId', authenticateToken, async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOneAndDelete({
      _id: appointmentId,
      userId: req.user.userId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error deleting appointment' });
  }
});

// Get checklist progress summary
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const checklist = await Checklist.findOne({ userId: req.user.userId });
    const appointments = await Appointment.find({ userId: req.user.userId });
    const user = await User.findById(req.user.userId).select('licenseStatus');

    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    // Group items by category
    const itemsByCategory = checklist.items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { total: 0, completed: 0, items: [] };
      }
      acc[item.category].total++;
      if (item.completed) {
        acc[item.category].completed++;
      }
      acc[item.category].items.push(item);
      return acc;
    }, {});

    // Calculate category progress
    Object.keys(itemsByCategory).forEach(category => {
      const categoryData = itemsByCategory[category];
      categoryData.progress = Math.round((categoryData.completed / categoryData.total) * 100);
    });

    res.json({
      overallProgress: checklist.overallProgress,
      licenseStatus: user.licenseStatus,
      categories: itemsByCategory,
      upcomingAppointments: appointments
        .filter(apt => apt.status === 'scheduled' && new Date(apt.scheduledDate) > new Date())
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
        .slice(0, 3)
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error fetching progress' });
  }
});

module.exports = router;
