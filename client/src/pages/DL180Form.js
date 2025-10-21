import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FileText, 
  Save, 
  Send,
  CheckCircle,
  AlertCircle,
  User,
  Shield,
  Stethoscope,
  Eye,
  Calendar
} from 'lucide-react';

const DL180Form = () => {
  const [form, setForm] = useState(null);
  const [formStatus, setFormStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    fetchForm();
  }, []);

  const fetchForm = async () => {
    try {
      const response = await axios.get('/api/form');
      setForm(response.data.form);
      
      // Pre-populate form with existing data
      if (response.data.form) {
        Object.keys(response.data.form).forEach(section => {
          if (response.data.form[section]) {
            Object.keys(response.data.form[section]).forEach(field => {
              if (response.data.form[section][field]) {
                setValue(`${section}.${field}`, response.data.form[section][field]);
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const fetchFormStatus = async () => {
    try {
      const response = await axios.get('/api/form/status');
      setFormStatus(response.data);
    } catch (error) {
      console.error('Error fetching form status:', error);
    }
  };

  useEffect(() => {
    fetchFormStatus();
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await axios.put('/api/form', data);
      toast.success('Form saved successfully');
      fetchForm();
      fetchFormStatus();
    } catch (error) {
      toast.error('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  const onSubmitForm = async () => {
    setSubmitting(true);
    try {
      const response = await axios.post('/api/form/submit');
      toast.success('Form submitted successfully!');
      fetchFormStatus();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit form';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const getCompletionPercentage = () => {
    if (!formStatus) return 0;
    return formStatus.completionPercentage || 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'submitted': return 'text-blue-600 bg-blue-100';
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">DL-180 Form</h1>
          </div>
          {formStatus && (
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(formStatus.status)}`}>
                {formStatus.status}
              </span>
              <span className="text-sm text-gray-600">
                {getCompletionPercentage()}% Complete
              </span>
            </div>
          )}
        </div>
        
        {formStatus && (
          <div className="mt-4">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Form Guidance */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Form Completion Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Personal Information</h3>
            </div>
            <p className="text-sm text-blue-700">
              Complete your personal details and contact information
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium text-purple-900">Military Information</h3>
            </div>
            <p className="text-sm text-purple-700">
              Provide your military service details
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Stethoscope className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-green-900">Medical Examination</h3>
            </div>
            <p className="text-sm text-green-700">
              Requires physician signature and examination
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Personal Information</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name *</label>
              <input
                {...register('personalInfo.firstName', { required: 'First name is required' })}
                className="input-field"
                placeholder="John"
              />
              {errors.personalInfo?.firstName && (
                <p className="error-text">{errors.personalInfo.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="label">Last Name *</label>
              <input
                {...register('personalInfo.lastName', { required: 'Last name is required' })}
                className="input-field"
                placeholder="Doe"
              />
              {errors.personalInfo?.lastName && (
                <p className="error-text">{errors.personalInfo.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="label">Middle Name</label>
              <input
                {...register('personalInfo.middleName')}
                className="input-field"
                placeholder="Michael"
              />
            </div>

            <div>
              <label className="label">Date of Birth *</label>
              <input
                {...register('personalInfo.dateOfBirth', { required: 'Date of birth is required' })}
                type="date"
                className="input-field"
              />
              {errors.personalInfo?.dateOfBirth && (
                <p className="error-text">{errors.personalInfo.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label className="label">Social Security Number *</label>
              <input
                {...register('personalInfo.socialSecurityNumber', { 
                  required: 'SSN is required',
                  pattern: {
                    value: /^\d{3}-\d{2}-\d{4}$/,
                    message: 'Format: XXX-XX-XXXX'
                  }
                })}
                className="input-field"
                placeholder="123-45-6789"
              />
              {errors.personalInfo?.socialSecurityNumber && (
                <p className="error-text">{errors.personalInfo.socialSecurityNumber.message}</p>
              )}
            </div>

            <div>
              <label className="label">Phone Number</label>
              <input
                {...register('personalInfo.phone')}
                className="input-field"
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Email Address</label>
              <input
                {...register('personalInfo.email')}
                type="email"
                className="input-field"
                placeholder="john.doe@email.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Street Address *</label>
              <input
                {...register('personalInfo.address.street', { required: 'Street address is required' })}
                className="input-field"
                placeholder="123 Main Street"
              />
              {errors.personalInfo?.address?.street && (
                <p className="error-text">{errors.personalInfo.address.street.message}</p>
              )}
            </div>

            <div>
              <label className="label">City *</label>
              <input
                {...register('personalInfo.address.city', { required: 'City is required' })}
                className="input-field"
                placeholder="Harrisburg"
              />
              {errors.personalInfo?.address?.city && (
                <p className="error-text">{errors.personalInfo.address.city.message}</p>
              )}
            </div>

            <div>
              <label className="label">State *</label>
              <select
                {...register('personalInfo.address.state', { required: 'State is required' })}
                className="input-field"
              >
                <option value="">Select State</option>
                <option value="PA">Pennsylvania</option>
              </select>
              {errors.personalInfo?.address?.state && (
                <p className="error-text">{errors.personalInfo.address.state.message}</p>
              )}
            </div>

            <div>
              <label className="label">ZIP Code *</label>
              <input
                {...register('personalInfo.address.zipCode', { 
                  required: 'ZIP code is required',
                  pattern: {
                    value: /^\d{5}(-\d{4})?$/,
                    message: 'Format: XXXXX or XXXXX-XXXX'
                  }
                })}
                className="input-field"
                placeholder="17101"
              />
              {errors.personalInfo?.address?.zipCode && (
                <p className="error-text">{errors.personalInfo.address.zipCode.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Military Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <span>Military Information</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Military ID *</label>
              <input
                {...register('militaryInfo.militaryId', { required: 'Military ID is required' })}
                className="input-field"
                placeholder="Enter your Military ID"
              />
              {errors.militaryInfo?.militaryId && (
                <p className="error-text">{errors.militaryInfo.militaryId.message}</p>
              )}
            </div>

            <div>
              <label className="label">Rank *</label>
              <input
                {...register('militaryInfo.rank', { required: 'Rank is required' })}
                className="input-field"
                placeholder="SGT"
              />
              {errors.militaryInfo?.rank && (
                <p className="error-text">{errors.militaryInfo.rank.message}</p>
              )}
            </div>

            <div>
              <label className="label">Base *</label>
              <input
                {...register('militaryInfo.base', { required: 'Base is required' })}
                className="input-field"
                placeholder="Fort Bragg"
              />
              {errors.militaryInfo?.base && (
                <p className="error-text">{errors.militaryInfo.base.message}</p>
              )}
            </div>

            <div>
              <label className="label">Branch of Service *</label>
              <select
                {...register('militaryInfo.branch', { required: 'Branch is required' })}
                className="input-field"
              >
                <option value="">Select Branch</option>
                <option value="Army">Army</option>
                <option value="Navy">Navy</option>
                <option value="Air Force">Air Force</option>
                <option value="Marines">Marines</option>
                <option value="Coast Guard">Coast Guard</option>
                <option value="Space Force">Space Force</option>
              </select>
              {errors.militaryInfo?.branch && (
                <p className="error-text">{errors.militaryInfo.branch.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Stethoscope className="h-5 w-5 text-green-600" />
            <span>Medical Examination</span>
          </h2>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800">Physician Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  This section must be completed by a licensed physician. Schedule an appointment with your medical provider.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Physician Name *</label>
              <input
                {...register('medicalInfo.physicianName', { required: 'Physician name is required' })}
                className="input-field"
                placeholder="Dr. Smith"
              />
              {errors.medicalInfo?.physicianName && (
                <p className="error-text">{errors.medicalInfo.physicianName.message}</p>
              )}
            </div>

            <div>
              <label className="label">Physician License Number *</label>
              <input
                {...register('medicalInfo.physicianLicense', { required: 'License number is required' })}
                className="input-field"
                placeholder="MD123456"
              />
              {errors.medicalInfo?.physicianLicense && (
                <p className="error-text">{errors.medicalInfo.physicianLicense.message}</p>
              )}
            </div>

            <div>
              <label className="label">Physician Phone</label>
              <input
                {...register('medicalInfo.physicianPhone')}
                className="input-field"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="label">Examination Date *</label>
              <input
                {...register('medicalInfo.examinationDate', { required: 'Examination date is required' })}
                type="date"
                className="input-field"
              />
              {errors.medicalInfo?.examinationDate && (
                <p className="error-text">{errors.medicalInfo.examinationDate.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="label">Physician Address</label>
              <input
                {...register('medicalInfo.physicianAddress')}
                className="input-field"
                placeholder="123 Medical Center Dr, City, State"
              />
            </div>

            <div>
              <label className="label">Right Eye Vision</label>
              <input
                {...register('medicalInfo.visionTest.rightEye')}
                className="input-field"
                placeholder="20/20"
              />
            </div>

            <div>
              <label className="label">Left Eye Vision</label>
              <input
                {...register('medicalInfo.visionTest.leftEye')}
                className="input-field"
                placeholder="20/20"
              />
            </div>

            <div>
              <label className="label">Both Eyes Vision</label>
              <input
                {...register('medicalInfo.visionTest.bothEyes')}
                className="input-field"
                placeholder="20/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Medical Conditions</label>
              <textarea
                {...register('medicalInfo.medicalConditions')}
                className="input-field"
                rows="3"
                placeholder="List any medical conditions that may affect driving..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Current Medications</label>
              <textarea
                {...register('medicalInfo.medications')}
                className="input-field"
                rows="3"
                placeholder="List current medications..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Driving Restrictions</label>
              <textarea
                {...register('medicalInfo.restrictions')}
                className="input-field"
                rows="3"
                placeholder="Any restrictions on driving (if applicable)..."
              />
            </div>

            <div>
              <label className="label">Physician Signature *</label>
              <input
                {...register('medicalInfo.physicianSignature', { required: 'Physician signature is required' })}
                className="input-field"
                placeholder="Dr. Smith"
              />
              {errors.medicalInfo?.physicianSignature && (
                <p className="error-text">{errors.medicalInfo.physicianSignature.message}</p>
              )}
            </div>

            <div>
              <label className="label">Physician Signature Date *</label>
              <input
                {...register('medicalInfo.physicianDate', { required: 'Signature date is required' })}
                type="date"
                className="input-field"
              />
              {errors.medicalInfo?.physicianDate && (
                <p className="error-text">{errors.medicalInfo.physicianDate.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Form'}</span>
            </button>

            <button
              type="button"
              onClick={onSubmitForm}
              disabled={submitting || formStatus?.status === 'submitted'}
              className="btn-outline flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Form'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DL180Form;
