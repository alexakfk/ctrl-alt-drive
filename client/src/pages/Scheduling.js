import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  MapPin, 
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Car,
  Building
} from 'lucide-react';

const Scheduling = () => {
  const [dmvLocations, setDmvLocations] = useState([]);
  const [drivingSchools, setDrivingSchools] = useState([]);
  const [aaaServices, setAaaServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dmv');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dmvResponse, schoolsResponse, aaaResponse] = await Promise.all([
        axios.get('/api/scheduling/dmv-locations'),
        axios.get('/api/scheduling/driving-schools'),
        axios.get('/api/scheduling/aaa-services')
      ]);

      setDmvLocations(dmvResponse.data.locations);
      setDrivingSchools(schoolsResponse.data.schools);
      setAaaServices(aaaResponse.data.services);
    } catch (error) {
      console.error('Error fetching scheduling data:', error);
      toast.error('Failed to load scheduling information');
    } finally {
      setLoading(false);
    }
  };

  const requestDMVAppointment = async (locationId, preferredDate, serviceType) => {
    try {
      const response = await axios.post('/api/scheduling/dmv-appointment', {
        locationId,
        preferredDate,
        serviceType
      });
      
      toast.success('DMV appointment request submitted successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to request DMV appointment');
      throw error;
    }
  };

  const contactDrivingSchool = async (schoolId, message, contactMethod) => {
    try {
      const response = await axios.post('/api/scheduling/contact-school', {
        schoolId,
        message,
        contactMethod
      });
      
      toast.success('Contact request sent to driving school!');
      return response.data;
    } catch (error) {
      toast.error('Failed to contact driving school');
      throw error;
    }
  };

  const requestAAAService = async (serviceId, preferredDate, location, notes) => {
    try {
      const response = await axios.post('/api/scheduling/aaa-service', {
        serviceId,
        preferredDate,
        location,
        notes
      });
      
      toast.success('AAA service request submitted successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to request AAA service');
      throw error;
    }
  };

  const tabs = [
    { id: 'dmv', name: 'DMV Locations', icon: Building },
    { id: 'schools', name: 'Driving Schools', icon: Car },
    { id: 'aaa', name: 'AAA Services', icon: Users }
  ];

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
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Scheduling & Partnerships</h1>
        </div>
        <p className="text-gray-600">
          Connect with DMV locations, driving schools, and AAA services to streamline your license process.
        </p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* DMV Locations Tab */}
      {activeTab === 'dmv' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">DMV Locations</h2>
            <p className="text-gray-600 mb-6">
              Find DMV locations near you. Many locations offer military priority scheduling.
            </p>
            
            {dmvLocations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dmvLocations.map((location) => (
                  <div key={location._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{location.name}</h3>
                      {location.militarySlots && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Military Priority
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{location.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{location.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Mon-Fri: 8AM-4PM</span>
                      </div>
                    </div>

                    {location.militarySlots && (
                      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                        <strong>Military Slots:</strong> {location.militarySlotsPerWeek} per week available
                      </div>
                    )}

                    <div className="mt-4">
                      <button
                        onClick={() => {
                          const preferredDate = prompt('Enter preferred date (YYYY-MM-DD):');
                          if (preferredDate) {
                            requestDMVAppointment(location._id, preferredDate, 'knowledge-test');
                          }
                        }}
                        className="btn-primary w-full text-sm"
                      >
                        Request Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No DMV locations available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Driving Schools Tab */}
      {activeTab === 'schools' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Partner Driving Schools</h2>
            <p className="text-gray-600 mb-6">
              Connect with driving schools that offer military discounts and DMV scheduling assistance.
            </p>
            
            {drivingSchools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drivingSchools.map((school) => (
                  <div key={school._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{school.name}</h3>
                      {school.militaryDiscount && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Military Discount: {school.militaryDiscountPercentage}%
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{school.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{school.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{school.email}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Services:</h4>
                      <div className="flex flex-wrap gap-1">
                        {school.services.map((service) => (
                          <span key={service} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {school.dmvScheduling && (
                      <div className="mb-4 p-2 bg-blue-50 rounded text-xs text-blue-700">
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        <strong>DMV Scheduling:</strong> Can help schedule your road test
                      </div>
                    )}

                    <div className="mt-4">
                      <button
                        onClick={() => {
                          const message = prompt('Enter your message to the driving school:');
                          if (message) {
                            contactDrivingSchool(school._id, message, 'email');
                          }
                        }}
                        className="btn-primary w-full text-sm"
                      >
                        Contact School
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No driving schools available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AAA Services Tab */}
      {activeTab === 'aaa' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AAA Services for Military</h2>
            <p className="text-gray-600 mb-6">
              AAA offers special services and discounts for military personnel to help with the license process.
            </p>
            
            {aaaServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aaaServices.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{service.name}</h3>
                      {service.militaryDiscount && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Military Discount: {service.discountPercentage}%
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Available Locations:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.locations.map((location) => (
                          <li key={location} className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3" />
                            <span>{location}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => {
                          const notes = prompt('Enter any specific requirements or notes:');
                          requestAAAService(service.id, null, 'On-base service', notes);
                        }}
                        className="btn-primary w-full text-sm"
                      >
                        Request Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No AAA services available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Scheduling Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">DMV Appointments</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Book appointments 2-3 weeks in advance</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Bring all required documents</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Arrive 15 minutes early</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Driving Schools</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Ask about military discounts</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Inquire about DMV scheduling help</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Check instructor credentials</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
