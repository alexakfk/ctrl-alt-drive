import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ChecklistContext = createContext();

export const useChecklist = () => {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error('useChecklist must be used within a ChecklistProvider');
  }
  return context;
};

export const ChecklistProvider = ({ children }) => {
  const [checklist, setChecklist] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/checklist');
      setChecklist(response.data.checklist);
    } catch (error) {
      console.error('Error fetching checklist:', error);
      toast.error('Failed to load checklist');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/checklist/appointments');
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await axios.get('/api/checklist/progress');
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const updateChecklistItem = async (itemId, updates) => {
    try {
      const response = await axios.put(`/api/checklist/item/${itemId}`, updates);
      if (checklist) {
        const updatedItems = checklist.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        );
        setChecklist({ ...checklist, items: updatedItems });
      }
      toast.success('Checklist updated');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const addCustomItem = async (itemData) => {
    try {
      const response = await axios.post('/api/checklist/item', itemData);
      if (checklist) {
        setChecklist({
          ...checklist,
          items: [...checklist.items, response.data.item]
        });
      }
      toast.success('Custom item added');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const createAppointment = async (appointmentData) => {
    try {
      const response = await axios.post('/api/checklist/appointments', appointmentData);
      setAppointments([...appointments, response.data.appointment]);
      toast.success('Appointment scheduled');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to schedule appointment';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateAppointment = async (appointmentId, updates) => {
    try {
      const response = await axios.put(`/api/checklist/appointments/${appointmentId}`, updates);
      setAppointments(appointments.map(apt => 
        apt._id === appointmentId ? response.data.appointment : apt
      ));
      toast.success('Appointment updated');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update appointment';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(`/api/checklist/appointments/${appointmentId}`);
      setAppointments(appointments.filter(apt => apt._id !== appointmentId));
      toast.success('Appointment cancelled');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel appointment';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    fetchChecklist();
    fetchAppointments();
    fetchProgress();
  }, []);

  const value = {
    checklist,
    appointments,
    progress,
    loading,
    fetchChecklist,
    fetchAppointments,
    fetchProgress,
    updateChecklistItem,
    addCustomItem,
    createAppointment,
    updateAppointment,
    deleteAppointment
  };

  return (
    <ChecklistContext.Provider value={value}>
      {children}
    </ChecklistContext.Provider>
  );
};
