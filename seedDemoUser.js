const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/military-license-assistance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Check if demo user already exists
  const existingUser = await User.findOne({ email: 'demo@military.mil' });
  
  if (existingUser) {
    console.log('Demo user already exists');
    process.exit(0);
  }
  
  // Create demo user
  const demoUser = new User({
    militaryId: 'DEMO123456',
    email: 'demo@military.mil',
    password: 'demo123', // Will be hashed by the pre-save hook
    firstName: 'Demo',
    lastName: 'User',
    rank: 'E-5',
    base: 'Fort Bragg',
    phone: '555-0100',
    profileComplete: true,
    licenseStatus: 'knowledge-test'
  });
  
  await demoUser.save();
  console.log('Demo user created successfully!');
  console.log('Email: demo@military.mil');
  console.log('Password: demo123');
  
  process.exit(0);
})
.catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

