import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock, Shield, Phone, MapPin } from 'lucide-react';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await registerUser(data);
    setIsLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the Military License Assistant
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="label">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('firstName', {
                      required: 'First name is required'
                    })}
                    type="text"
                    className="input-field pl-10"
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="error-text">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="label">
                  Last Name
                </label>
                <input
                  {...register('lastName', {
                    required: 'Last name is required'
                  })}
                  type="text"
                  className="input-field"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="error-text">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="militaryId" className="label">
                Military ID
              </label>
              <input
                {...register('militaryId', {
                  required: 'Military ID is required'
                })}
                type="text"
                className="input-field"
                placeholder="Enter your Military ID"
              />
              {errors.militaryId && (
                <p className="error-text">{errors.militaryId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="rank" className="label">
                  Rank
                </label>
                <select
                  {...register('rank', {
                    required: 'Rank is required'
                  })}
                  className="input-field"
                >
                  <option value="">Select Rank</option>
                  <option value="PVT">Private (PVT)</option>
                  <option value="PFC">Private First Class (PFC)</option>
                  <option value="SPC">Specialist (SPC)</option>
                  <option value="CPL">Corporal (CPL)</option>
                  <option value="SGT">Sergeant (SGT)</option>
                  <option value="SSG">Staff Sergeant (SSG)</option>
                  <option value="SFC">Sergeant First Class (SFC)</option>
                  <option value="MSG">Master Sergeant (MSG)</option>
                  <option value="1SG">First Sergeant (1SG)</option>
                  <option value="SGM">Sergeant Major (SGM)</option>
                  <option value="CSM">Command Sergeant Major (CSM)</option>
                  <option value="SMA">Sergeant Major of the Army (SMA)</option>
                  <option value="WO1">Warrant Officer 1 (WO1)</option>
                  <option value="CW2">Chief Warrant Officer 2 (CW2)</option>
                  <option value="CW3">Chief Warrant Officer 3 (CW3)</option>
                  <option value="CW4">Chief Warrant Officer 4 (CW4)</option>
                  <option value="CW5">Chief Warrant Officer 5 (CW5)</option>
                  <option value="2LT">Second Lieutenant (2LT)</option>
                  <option value="1LT">First Lieutenant (1LT)</option>
                  <option value="CPT">Captain (CPT)</option>
                  <option value="MAJ">Major (MAJ)</option>
                  <option value="LTC">Lieutenant Colonel (LTC)</option>
                  <option value="COL">Colonel (COL)</option>
                  <option value="BG">Brigadier General (BG)</option>
                  <option value="MG">Major General (MG)</option>
                  <option value="LTG">Lieutenant General (LTG)</option>
                  <option value="GEN">General (GEN)</option>
                </select>
                {errors.rank && (
                  <p className="error-text">{errors.rank.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="base" className="label">
                  Base
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('base', {
                      required: 'Base is required'
                    })}
                    type="text"
                    className="input-field pl-10"
                    placeholder="Fort Bragg"
                  />
                </div>
                {errors.base && (
                  <p className="error-text">{errors.base.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone Number (Optional)
              </label>
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

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                type="password"
                className="input-field"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
