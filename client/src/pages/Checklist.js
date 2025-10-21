import React, { useState } from 'react';
import { useChecklist } from '../contexts/ChecklistContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  CheckSquare, 
  Plus, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  BarChart3
} from 'lucide-react';

const Checklist = () => {
  const { 
    checklist, 
    appointments, 
    progress, 
    loading,
    updateChecklistItem,
    addCustomItem,
    createAppointment
  } = useChecklist();
  
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddAppointment, setShowAddAppointment] = useState(false);

  const {
    register: registerItem,
    handleSubmit: handleSubmitItem,
    reset: resetItem,
    formState: { errors: itemErrors }
  } = useForm();

  const {
    register: registerAppointment,
    handleSubmit: handleSubmitAppointment,
    reset: resetAppointment,
    formState: { errors: appointmentErrors }
  } = useForm();

  const toggleItem = async (itemId, completed) => {
    await updateChecklistItem(itemId, { completed });
  };

  const onSubmitItem = async (data) => {
    const result = await addCustomItem(data);
    if (result.success) {
      setShowAddItem(false);
      resetItem();
    }
  };

  const onSubmitAppointment = async (data) => {
    const result = await createAppointment({
      ...data,
      scheduledDate: new Date(data.scheduledDate),
      location: {
        name: data.locationName,
        address: data.locationAddress,
        phone: data.locationPhone
      }
    });
    if (result.success) {
      setShowAddAppointment(false);
      resetAppointment();
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'knowledge-test': return Target;
      case 'dl180-form': return CheckSquare;
      case 'eye-exam': return CheckCircle;
      case 'road-test': return Calendar;
      case 'documentation': return CheckSquare;
      default: return CheckSquare;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'knowledge-test': return 'bg-blue-500';
      case 'dl180-form': return 'bg-purple-500';
      case 'eye-exam': return 'bg-green-500';
      case 'road-test': return 'bg-orange-500';
      case 'documentation': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckSquare className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">License Checklist</h1>
          </div>
          <button
            onClick={() => setShowAddItem(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{progress.overallProgress}%</div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </div>
          
          {Object.entries(progress.categories).map(([category, data]) => (
            <div key={category} className="card text-center">
              <div className="flex items-center justify-center mb-2">
                {(() => {
                  const Icon = getCategoryIcon(category);
                  return <Icon className="h-5 w-5 text-gray-600" />;
                })()}
              </div>
              <div className="text-2xl font-bold text-gray-900">{data.progress}%</div>
              <div className="text-sm text-gray-600 capitalize">
                {category.replace('-', ' ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checklist Items */}
      {checklist && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Checklist Items</h2>
          <div className="space-y-4">
            {checklist.items.map((item) => {
              const CategoryIcon = getCategoryIcon(item.category);
              const categoryColor = getCategoryColor(item.category);
              const priorityColor = getPriorityColor(item.priority);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    item.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => toggleItem(item.id, !item.completed)}
                      className={`mt-1 p-1 rounded-full transition-colors ${
                        item.completed 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-current rounded-full"></div>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-1 rounded ${categoryColor} text-white`}>
                          <CategoryIcon className="h-4 w-4" />
                        </div>
                        <h3 className={`text-sm font-medium ${
                          item.completed ? 'text-green-800 line-through' : 'text-gray-900'
                        }`}>
                          {item.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColor}`}>
                          {item.priority}
                        </span>
                      </div>
                      
                      <p className={`text-sm ${
                        item.completed ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {item.description}
                      </p>

                      {item.completed && item.completedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Completed on {new Date(item.completedAt).toLocaleDateString()}
                        </p>
                      )}

                      {item.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                          <strong>Notes:</strong> {item.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
          <button
            onClick={() => setShowAddAppointment(true)}
            className="btn-outline flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Schedule Appointment</span>
          </button>
        </div>

        {appointments && appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No appointments scheduled yet</p>
            <p className="text-sm">Click "Schedule Appointment" to add one</p>
          </div>
        )}
      </div>

      {/* Add Custom Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Item</h3>
            <form onSubmit={handleSubmitItem(onSubmitItem)} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input
                  {...registerItem('title', { required: 'Title is required' })}
                  className="input-field"
                  placeholder="Enter item title"
                />
                {itemErrors.title && (
                  <p className="error-text">{itemErrors.title.message}</p>
                )}
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  {...registerItem('description', { required: 'Description is required' })}
                  className="input-field"
                  rows="3"
                  placeholder="Enter item description"
                />
                {itemErrors.description && (
                  <p className="error-text">{itemErrors.description.message}</p>
                )}
              </div>

              <div>
                <label className="label">Category</label>
                <select
                  {...registerItem('category', { required: 'Category is required' })}
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  <option value="knowledge-test">Knowledge Test</option>
                  <option value="dl180-form">DL-180 Form</option>
                  <option value="eye-exam">Eye Exam</option>
                  <option value="road-test">Road Test</option>
                  <option value="documentation">Documentation</option>
                </select>
                {itemErrors.category && (
                  <p className="error-text">{itemErrors.category.message}</p>
                )}
              </div>

              <div>
                <label className="label">Priority</label>
                <select
                  {...registerItem('priority')}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Add Item
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAddAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Appointment</h3>
            <form onSubmit={handleSubmitAppointment(onSubmitAppointment)} className="space-y-4">
              <div>
                <label className="label">Appointment Type</label>
                <select
                  {...registerAppointment('type', { required: 'Type is required' })}
                  className="input-field"
                >
                  <option value="">Select Type</option>
                  <option value="knowledge-test">Knowledge Test</option>
                  <option value="eye-exam">Eye Exam</option>
                  <option value="road-test">Road Test</option>
                </select>
                {appointmentErrors.type && (
                  <p className="error-text">{appointmentErrors.type.message}</p>
                )}
              </div>

              <div>
                <label className="label">Date & Time</label>
                <input
                  {...registerAppointment('scheduledDate', { required: 'Date is required' })}
                  type="datetime-local"
                  className="input-field"
                />
                {appointmentErrors.scheduledDate && (
                  <p className="error-text">{appointmentErrors.scheduledDate.message}</p>
                )}
              </div>

              <div>
                <label className="label">Location Name</label>
                <input
                  {...registerAppointment('locationName', { required: 'Location name is required' })}
                  className="input-field"
                  placeholder="DMV Office, Driving School, etc."
                />
                {appointmentErrors.locationName && (
                  <p className="error-text">{appointmentErrors.locationName.message}</p>
                )}
              </div>

              <div>
                <label className="label">Location Address</label>
                <input
                  {...registerAppointment('locationAddress')}
                  className="input-field"
                  placeholder="123 Main St, City, State"
                />
              </div>

              <div>
                <label className="label">Phone Number</label>
                <input
                  {...registerAppointment('locationPhone')}
                  className="input-field"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="label">Notes (Optional)</label>
                <textarea
                  {...registerAppointment('notes')}
                  className="input-field"
                  rows="3"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAppointment(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklist;
