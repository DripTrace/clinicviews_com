// // src/app/contact/page.tsx
// import PatientRegistration from '@/components/FSClinicals/PatientRegistration';
// import AppointmentSuggestion from '@/components/FSClinicals/AppointmentSuggestion';

// export default function Contact() {
//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-8 /*text-fsc-dark-blue*/ text-[#0C3C60]">Contact Us</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <PatientRegistration />
//         <AppointmentSuggestion />
//       </div>
//     </div>
//   );
// }

// pages/contact-us.tsx
import React from 'react';
import ContactPage from '@/components/FSClinicals/ContactPage';
// import { FSClinicalsHeader } from '@/components/FSClinicals/FSClinicalsHeader';
// import { FSClinicalsFooter } from '@/components/FSClinicals/FSClinicalsFooter';

const ContactUsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <FSClinicalsHeader /> */}
      <main className="flex-grow">
        <ContactPage />
      </main>
      {/* <FSClinicalsFooter /> */}
    </div>
  );
};

export default ContactUsPage;