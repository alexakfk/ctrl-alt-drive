import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChecklist } from '../contexts/ChecklistContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  BookOpen, 
  CheckSquare, 
  FileText, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { progress, checklist } = useChecklist();
  const [testStats, setTestStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestStats();
  }, []);

  const fetchTestStats = async () => {
    try {
      const response = await axios.get('/api/test/stats');
      setTestStats(response.data);
    } catch (error) {
      console.error('Error fetching test stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'not-started': return 'text-gray-500';
      case 'knowledge-test': return 'text-yellow-600';
      case 'practical-test': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'not-started': return AlertCircle;
      case 'knowledge-test': return Clock;
      case 'practical-test': return Clock;
      case 'completed': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const quickActions = [
    {
      title: 'Take Practice Test',
      description: 'Prepare for the PA knowledge test',
      icon: BookOpen,
      href: '/knowledge-test',
      color: 'bg-blue-500'
    },
    {
      title: 'Complete Checklist',
      description: 'Track your license progress',
      icon: CheckSquare,
      href: '/checklist',
      color: 'bg-green-500'
    },
    {
      title: 'Fill DL-180 Form',
      description: 'Complete required medical form',
      icon: FileText,
      href: '/dl180-form',
      color: 'bg-purple-500'
    },
    {
      title: 'Schedule Appointments',
      description: 'Book DMV and driving school',
      icon: Calendar,
      href: '/scheduling',
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-blue-100">
          Let's continue your journey to getting your Pennsylvania driver's license.
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{user.rank}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{user.base}</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completion</span>
                <span className="font-medium">{progress.overallProgress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress.overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">License Status</h3>
              {(() => {
                const StatusIcon = getStatusIcon(user.licenseStatus);
                return <StatusIcon className={`h-5 w-5 ${getStatusColor(user.licenseStatus)}`} />;
              })()}
            </div>
            <p className={`text-sm font-medium capitalize ${getStatusColor(user.licenseStatus)}`}>
              {user.licenseStatus.replace('-', ' ')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Current step in the process
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Test Performance</h3>
              <Target className="h-5 w-5 text-green-600" />
            </div>
            {testStats ? (
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Best Score: <span className="font-medium text-green-600">{testStats.bestScore}/18</span>
                </p>
                <p className="text-sm text-gray-600">
                  Pass Rate: <span className="font-medium text-blue-600">{testStats.passRate}%</span>
                </p>
                <p className="text-sm text-gray-600">
                  Tests Taken: <span className="font-medium">{testStats.totalTests}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No tests taken yet</p>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.href}
                className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {testStats && testStats.recentTests && testStats.recentTests.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Test Results</h2>
          <div className="space-y-3">
            {testStats.recentTests.slice(0, 3).map((test) => (
              <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    test.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {test.passed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {test.testType === 'practice' ? 'Practice Test' : 'Official Test'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(test.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {test.score}/18
                  </p>
                  <p className={`text-xs ${
                    test.passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {test.passed ? 'Passed' : 'Failed'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      {progress && progress.upcomingAppointments && progress.upcomingAppointments.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Appointments</h2>
          <div className="space-y-3">
            {progress.upcomingAppointments.map((appointment) => (
              <div key={appointment._id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appointment.location.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(appointment.scheduledDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(appointment.scheduledDate).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
