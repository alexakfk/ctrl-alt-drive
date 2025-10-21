import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      email: user?.email || ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await updateProfile(data);
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <User className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        </div>
        <p className="text-gray-600">
          Manage your personal information and account settings.
        </p>
      </div>

      {/* Profile Information */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className="input-field pl-10"
                  placeholder="John"
                />
              </div>
              {errors.firstName && (
                <p className="error-text">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="label">Last Name</label>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                className="input-field"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="error-text">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="input-field pl-10"
                placeholder="john.doe@military.mil"
              />
            </div>
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('phone', {
                  pattern: {
                    value: /^[\+]?[1-9][\d]{0,15}$/,
                    message: 'Invalid phone number'
                  }
                })}
                type="tel"
                className="input-field pl-10"
                placeholder="(555) 123-4567"
              />
            </div>
            {errors.phone && (
              <p className="error-text">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Military Information */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span>Military Information</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Military ID</label>
            <input
              value={user?.militaryId || ''}
              disabled
              className="input-field bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
          </div>

          <div>
            <label className="label">Rank</label>
            <input
              value={user?.rank || ''}
              disabled
              className="input-field bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
          </div>

          <div>
            <label className="label">Base</label>
            <input
              value={user?.base || ''}
              disabled
              className="input-field bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
          </div>

          <div>
            <label className="label">License Status</label>
            <input
              value={user?.licenseStatus?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || ''}
              disabled
              className="input-field bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Updates automatically</p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Account Created</p>
              <p className="text-xs text-gray-500">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Last Login</p>
              <p className="text-xs text-gray-500">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Profile Complete</p>
              <p className="text-xs text-gray-500">
                {user?.profileComplete ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900">Security & Privacy</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your personal information is encrypted and stored securely. We follow military-grade security standards to protect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
