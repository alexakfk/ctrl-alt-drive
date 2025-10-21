const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    id: String,
    title: String,
    description: String,
    category: {
      type: String,
      enum: ['knowledge-test', 'dl180-form', 'eye-exam', 'road-test', 'documentation']
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    notes: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Checklist = mongoose.model('Checklist', checklistSchema);

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['knowledge-test', 'eye-exam', 'road-test'],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  location: {
    name: String,
    address: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = { Checklist, Appointment };
