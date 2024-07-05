// components/FSClinicals/ContactPage.tsx
"use client"

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FSClinicalsRootState } from '@/store/fsclinicalsStore';
import PatientRegistration from './PatientRegistration';
import AppointmentSuggestion from './AppointmentSuggestion';
import { motion } from 'framer-motion';

interface AppointmentData {
  date: string;
  time: string;
}

const ContactPage: React.FC = () => {
  const isDarkMode = useSelector((state: FSClinicalsRootState) => state.theme.fsclinicalsIsDarkMode);
  const [activeTab, setActiveTab] = useState<'registration' | 'appointment'>('registration');
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({ date: '', time: '' });

  return (
    <div className={`p-4 ${isDarkMode ? 'bg-[#0C3C60] text-[#D1E0EB]' : 'bg-[#D1E0EB] text-[#0C3C60]'}`}>
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
      <div className="max-w-2xl mx-auto">
        <div className="relative mb-8">
          <div className="flex justify-between">
            <button
              onClick={() => setActiveTab('registration')}
              className={`w-1/2 py-2 text-center z-10 transition-colors duration-300 ${
                activeTab === 'registration' ? 'text-white' : 'text-[#0C3C60]'
              }`}
            >
              New Patient Registration
            </button>
            <button
              onClick={() => setActiveTab('appointment')}
              className={`w-1/2 py-2 text-center z-10 transition-colors duration-300 ${
                activeTab === 'appointment' ? 'text-white' : 'text-[#0C3C60]'
              }`}
            >
              Suggest Appointment
            </button>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-full bg-[#1FABC7] rounded-full"
            initial={false}
            animate={{
              x: activeTab === 'registration' ? '0%' : '100%',
              width: '50%',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
        {activeTab === 'registration' ? (
          <PatientRegistration />
        ) : (
          <AppointmentSuggestion
            appointmentData={appointmentData}
            onAppointmentChange={setAppointmentData}
          />
        )}
      </div>
    </div>
  );
};

export default ContactPage;