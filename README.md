# Military License Assistant

A comprehensive web application designed to help military personnel navigate the Pennsylvania driver's license process more efficiently.

## Features

### 🎯 Knowledge Test Preparation
- Interactive practice tests with 18 questions (need 15 to pass)
- Study materials organized by category
- Progress tracking and performance statistics
- Detailed explanations for each question

### ✅ Personal Checklist System
- Step-by-step progress tracking
- Customizable checklist items
- Appointment scheduling
- Progress visualization

### 📋 DL-180 Form Guidance
- Interactive form completion
- Step-by-step instructions
- Physician signature tracking
- Form validation and submission

### 📅 Scheduling & Partnerships
- DMV location finder with military priority
- Driving school partnerships with discounts
- AAA services for military personnel
- Appointment request system

### 🔐 Secure Authentication
- Military ID verification
- Encrypted data storage
- Role-based access control
- HIPAA-compliant data handling

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **Express Rate Limit** for API protection

### Frontend
- **React 18** with functional components
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp config.env.example config.env
   ```
   Edit `config.env` with your configuration:
   ```
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   MONGODB_URI=mongodb://localhost:27017/military-license-assistance
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   ```

3. **Seed the database with questions (first time only):**
   ```bash
   npm run seed:questions
   ```
   > **Note:** Make sure MongoDB is running. For MongoDB setup, either install locally or use MongoDB Atlas (cloud).

4. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/verify` - Verify JWT token

### Knowledge Test
- `GET /api/test/questions` - Get practice questions
- `POST /api/test/submit` - Submit test results
- `GET /api/test/history` - Get test history
- `GET /api/test/stats` - Get test statistics
- `GET /api/test/study-materials` - Get study materials

### Checklist
- `GET /api/checklist` - Get user checklist
- `PUT /api/checklist/item/:itemId` - Update checklist item
- `POST /api/checklist/item` - Add custom item
- `GET /api/checklist/appointments` - Get appointments
- `POST /api/checklist/appointments` - Create appointment
- `GET /api/checklist/progress` - Get progress summary

### DL-180 Form
- `GET /api/form` - Get form data
- `PUT /api/form` - Update form data
- `POST /api/form/submit` - Submit form
- `GET /api/form/status` - Get form status
- `GET /api/form/guidance` - Get form guidance

### Scheduling
- `GET /api/scheduling/dmv-locations` - Get DMV locations
- `GET /api/scheduling/driving-schools` - Get driving schools
- `GET /api/scheduling/aaa-services` - Get AAA services
- `POST /api/scheduling/dmv-appointment` - Request DMV appointment
- `POST /api/scheduling/contact-school` - Contact driving school
- `POST /api/scheduling/aaa-service` - Request AAA service

## Database Schema

### User Model
```javascript
{
  militaryId: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  firstName: String (required),
  lastName: String (required),
  rank: String (required),
  base: String (required),
  phone: String,
  profileComplete: Boolean,
  licenseStatus: String (enum),
  createdAt: Date,
  lastLogin: Date
}
```

### Test Models
```javascript
// TestResult
{
  userId: ObjectId,
  testType: String (enum),
  score: Number,
  passed: Boolean,
  questions: Array,
  timeSpent: Number,
  completedAt: Date
}

// Question
{
  questionId: String (unique),
  question: String,
  options: Array,
  correctAnswer: String,
  explanation: String,
  category: String,
  difficulty: String (enum),
  isActive: Boolean
}
```

### Checklist Models
```javascript
// Checklist
{
  userId: ObjectId,
  items: Array,
  overallProgress: Number,
  lastUpdated: Date
}

// Appointment
{
  userId: ObjectId,
  type: String (enum),
  scheduledDate: Date,
  location: Object,
  status: String (enum),
  notes: String
}
```

## Security Features

- **Password Hashing**: bcryptjs with configurable rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API request rate limiting
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: Express-validator for input sanitization
- **CORS Protection**: Configured CORS policies
- **Data Encryption**: Sensitive data encryption at rest

## Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## Deployment

### Production Environment Variables
```bash
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
MONGODB_URI=your-production-mongodb-uri
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=https://your-domain.com
```

### Build for Production
```bash
# Backend
npm install --production

# Frontend
cd client
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Acknowledgments

- Pennsylvania DMV for licensing requirements
- Military personnel for feedback and requirements
- Open source community for tools and libraries